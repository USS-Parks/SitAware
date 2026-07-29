#!/usr/bin/env python3
"""Server-side fetch of the federal data the app needs, published as
same-origin snapshots under data/ at deploy time. The app falls back to
these when a client's network cannot reach the federal hosts directly
(agency content filters kill cross-origin API calls that plain browsing
survives). Partial success is fine: each artifact is independent, and a
missing file simply means no fallback for that panel. Always exits 0."""
import json
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

LAT, LON = 40.9214, -123.6191  # canonical operating point (PSA-zoned data)
WFO = 'EKA'
API = 'https://fsapps.nwcg.gov/psp/npsg/forecast/api'
TS = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
DATA = Path('data')
(DATA / 'conus').mkdir(parents=True, exist_ok=True)


def get(url, binary=False, timeout=90):
    req = urllib.request.Request(
        url, headers={'User-Agent': 'SitAware-snapshot (github.com/USS-Parks/SitAware)'})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        body = r.read()
    return body if binary else json.loads(body)


def write(name, obj):
    (DATA / name).write_text(json.dumps(obj), encoding='utf-8')
    print(f'{name}: ok')


def attempt(name, fn):
    try:
        fn()
    except Exception as e:
        print(f'{name}: FAILED ({e})', file=sys.stderr)


def gacc_outlook():
    gaccs = get(f'{API}/gaccs?geo=false')
    g = next(x for x in gaccs if 'North Ops' in (x.get('name') or ''))
    lf = get(f"{API}/gaccs/{g['gaccId']}/latest-forecast")
    psas = get(f"{API}/gaccs/{g['gaccId']}/psas?geo=false")
    rows = get(f"{API}/forecasts/{lf['forecastId']}/data")
    write('gacc-outlook.json', {
        'fetchedAt': TS, 'gaccId': g['gaccId'], 'gaccName': g['name'],
        'lf': lf, 'psas': psas, 'rows': rows})


def fire_potential():
    base = 'https://fsapps.nwcg.gov/psp/arcgis/rest/services/npsg'
    q = (f'geometry={LON},{LAT}&geometryType=esriGeometryPoint'
         '&spatialRel=esriSpatialRelIntersects&returnGeometry=false&f=json')
    psa = get(f'{base}/PSA_GACC_KeyRAWS/MapServer/1/query?{q}'
              '&outFields=PSA_NAME,NAT_CODE,GACC_Label,Unit_ID')
    feats = psa.get('features') or []
    psa_meta = feats[0].get('attributes', {}) if feats else {}
    days = []
    for i in range(7):
        try:
            d = get(f'{base}/outlooks_forecast/MapServer/{i}/query?{q}'
                    '&outFields=drynesscode,timestampdate,nat_code,gacc_name')
            dfeats = d.get('features') or []
            days.append(dfeats[0]['attributes'] if dfeats else None)
        except Exception:
            days.append(None)
    if all(d is None for d in days) and not psa_meta:
        raise RuntimeError('no PSA data at all')
    write('fire-potential.json', {
        'fetchedAt': TS, 'point': {'lat': LAT, 'lon': LON},
        'psaMeta': psa_meta, 'dayResults': days})


def fwf():
    listing = get(f'https://api.weather.gov/products?type=FWF&location={WFO}&limit=1')
    pid = listing['@graph'][0]['id']
    prod = get(f'https://api.weather.gov/products/{pid}')
    write('fwf.json', {
        'fetchedAt': TS, 'wfo': WFO,
        'issuanceTime': prod.get('issuanceTime', ''),
        'productText': prod.get('productText', '')})


def conus():
    ok = 0
    for i in range(1, 8):
        try:
            png = get(f'https://fsapps.nwcg.gov/psp/npsg/data/conus-sevenday/d{i}_0.png',
                      binary=True)
            (DATA / 'conus' / f'd{i}_0.png').write_bytes(png)
            ok += 1
        except Exception as e:
            print(f'conus d{i}: FAILED ({e})', file=sys.stderr)
    print(f'conus: {ok}/7')


attempt('gacc-outlook', gacc_outlook)
attempt('fire-potential', fire_potential)
attempt('fwf', fwf)
attempt('conus', conus)
sys.exit(0)

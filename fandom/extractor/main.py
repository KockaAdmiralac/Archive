from PIL import Image
import json
import os

cwd = os.getcwd() + '/generated/altar'
files = [int(f[0:-5]) for f in os.listdir('%s/texpage' % cwd)]
for i in files:
    data = json.load(open('%s/texpage/%d.json' % (cwd, i)))
    src = data['src']
    image = Image.open('%s/texture/%d.png' % (cwd, data['sheetid'])).crop((src['x'], src['y'], src['x'] + src['width'], src['y'] + src['height'])).save('%s/extract/%d.png' % (cwd, i))

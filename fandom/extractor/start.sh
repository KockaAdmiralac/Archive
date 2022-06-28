echo "Deleting old files..."
rm -rf generated
rm -rf output
echo "Creating required directories..."
mkdir generated
mkdir output
mkdir generated/quickbms
mkdir generated/altar
mkdir generated/altar/extract
mkdir output/backgrounds
mkdir output/sprites
mkdir output/json
mkdir output/code
echo "Using quickbms to extract data..."
./tools/quickbms tools/yoyogames.bms game.unx ./generated/quickbms
echo "Collecting useful data from quickbms..."
cp generated/quickbms/STRG.txt output/strings.txt
echo "Using Altar to extract data..."
mono tools/altar.exe export -gonsbpifjmtacuwh --file game.unx --out generated/altar
echo "Installing required Python resources..."
pip install pillow
echo "Generating textures..."
python3 scripts/main.py
echo "Separating sprites and backgrounds"
node scripts/main.js
echo "Copying the rest of useful stuff"
cp generated/altar/code/* output/code
cp generated/altar/options.json output/json
cp generated/altar/general.json output/json
echo "Finished!"

const {PDFDocument, PDFDict, PDFName, PngEmbedder} = require('pdf-lib');
const {readFile, writeFile} = require('fs').promises;

const MAGIC_NUMBER = 24391;

function findObjectForNumber(dict, number) {
    const ref = Array.from(dict.keys()).find(k => k.objectNumber === number);
    return [ref, dict.get(ref)];
}

async function main() {
    const pdf = await PDFDocument.load(await readFile('5.pdf'));
    const png = await readFile('yes.png');
    for (const page of pdf.getPages()) {
        const dict = page.node.Resources().lookup(PDFName.of('XObject'), PDFDict);
        const streams = Array.from(dict.dict.values())
            .map(v => findObjectForNumber(dict.context.indirectObjects, v.objectNumber))
        for (const [ref, stream] of streams) {
            if (stream.getContentsSize() === MAGIC_NUMBER) {
                const embedder = await PngEmbedder.for(png);
                const image = pdf.context.flateStream(embedder.image.rgbChannel, {
                    Type: 'XObject',
                    Subtype: 'Image',
                    BitsPerComponent: embedder.image.bitsPerComponent,
                    Width: embedder.image.width,
                    Height: embedder.image.height,
                    ColorSpace: embedder.colorSpace
                });
                pdf.context.delete(ref);
                pdf.context.assign(ref, image);
            }
        }
    }
    await writeFile('5-new.pdf', await pdf.save());
}

main();

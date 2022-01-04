import fs from "fs";
import {interpreter} from "./interpreter";
import {documenting} from "./documenting";

const src = fs.readFileSync('clips-doc.out', 'utf8');

const interpreted = interpreter(src)
const documented = documenting(interpreted)

fs.writeFileSync('out.html', documented, {encoding:'utf8'})
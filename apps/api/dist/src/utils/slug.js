"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSlug = makeSlug;
const slugify_1 = require("slugify");
function makeSlug(input) {
    return (0, slugify_1.default)(input, {
        lower: true,
        strict: true,
        trim: true,
    });
}
//# sourceMappingURL=slug.js.map
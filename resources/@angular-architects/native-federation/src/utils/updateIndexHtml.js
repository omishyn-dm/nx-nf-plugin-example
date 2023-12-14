'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.updateScriptTags = exports.updateIndexHtml = void 0;
const tslib_1 = require('tslib');
const path = tslib_1.__importStar(require('path'));
const fs = tslib_1.__importStar(require('fs'));
function updateIndexHtml(fedOptions) {
	const outputPath = path.join(fedOptions.workspaceRoot, fedOptions.outputPath);
	const indexPath = path.join(outputPath, 'index.html');
	const mainName = fs.readdirSync(outputPath).find((f) => f.startsWith('main') && f.endsWith('.js'));
	const polyfillsName = fs.readdirSync(outputPath).find((f) => f.startsWith('polyfills') && f.endsWith('.js'));
	let indexContent = fs.readFileSync(indexPath, 'utf-8');
	indexContent = updateScriptTags(indexContent, mainName, polyfillsName);
	fs.writeFileSync(indexPath, indexContent, 'utf-8');
}
exports.updateIndexHtml = updateIndexHtml;
function updateScriptTags(indexContent, mainName, polyfillsName) {
	const htmlFragment = `
<script type="esms-options">
{
  "shimMode": true
}
</script>

<script type="module" src="${polyfillsName}"></script>
<script type="module-shim" src="${mainName}"></script>
`;
	indexContent = indexContent.replace(/<script src="polyfills.*?>/, '');
	indexContent = indexContent.replace(/<script src="main.*?>/, '');
	indexContent = indexContent.replace(/<\/script><\/script>/, '');
	indexContent = indexContent.replace('</body>', `${htmlFragment}</body>`);
	return indexContent;
}
exports.updateScriptTags = updateScriptTags;
//# sourceMappingURL=updateIndexHtml.js.map

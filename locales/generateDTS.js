import * as fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import * as yaml from 'js-yaml';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createMembers(record) {
	return Object.entries(record)
		.map(([k, v]) => ts.factory.createPropertySignature(
			undefined,
			ts.factory.createStringLiteral(k),
			undefined,
			typeof v === 'string'
				? ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
				: ts.factory.createTypeLiteralNode(createMembers(v)),
		));
}

export default function generateDTS() {
	const locale = yaml.load(fs.readFileSync(`${__dirname}/ja-JP.yml`, 'utf-8'));
	const members = createMembers(locale);
	const elements = [
		ts.factory.createInterfaceDeclaration(
			[ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
			ts.factory.createIdentifier('Locale'),
			undefined,
			undefined,
			members,
		),
		ts.factory.createVariableStatement(
			[ts.factory.createToken(ts.SyntaxKind.DeclareKeyword)],
			ts.factory.createVariableDeclarationList(
				[ts.factory.createVariableDeclaration(
					ts.factory.createIdentifier('locales'),
					undefined,
					ts.factory.createTypeLiteralNode([ts.factory.createIndexSignature(
						undefined,
						[ts.factory.createParameterDeclaration(
							undefined,
							undefined,
							ts.factory.createIdentifier('lang'),
							undefined,
							ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
							undefined,
						)],
						ts.factory.createTypeReferenceNode(
							ts.factory.createIdentifier('Locale'),
							undefined,
						),
					)]),
					undefined,
				)],
				ts.NodeFlags.Const | ts.NodeFlags.Ambient | ts.NodeFlags.ContextFlags,
			),
		),
		ts.factory.createFunctionDeclaration(
			[ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
			undefined,
			ts.factory.createIdentifier('build'),
			undefined,
			[],
			ts.factory.createTypeReferenceNode(
				ts.factory.createIdentifier('Locale'),
				undefined,
			),
			undefined,
		),
		ts.factory.createExportDefault(ts.factory.createIdentifier('locales')),
	];
	const printed = ts.createPrinter({
		newLine: ts.NewLineKind.LineFeed,
	}).printList(
		ts.ListFormat.MultiLine,
		ts.factory.createNodeArray(elements),
		ts.createSourceFile('index.d.ts', '', ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS),
	);

	fs.writeFileSync(`${__dirname}/index.d.ts`, `/* eslint-disable */
// This file is generated by locales/generateDTS.js
// Do not edit this file directly.
${printed}`, 'utf-8');
}

import sql from '@/sql'

var nameMapInit = false;
const nameMap = {
	CID: 'Course',
	SID: 'Student',
	TID: 'Teacher'
}
async function initNameMap(key) {
	const tableName = nameMap[key];
	nameMap[key] = new Map();
	for (const row of await sql.query(`SELECT \`ID\`, \`Name\` FROM \`${tableName}\``))
		nameMap[key].set(row['ID'], row['Name']);
}

export async function constraintCheck(form) {
	if (form['EntranceAge'] !== undefined && (10 > form['EntranceAge'] || form['EntranceAge'] > 50))
		throw 'Entrance age should be between 10 and 50!';
	if (form['Credit'] !== undefined && form['Credit'] <= 0)
		throw 'Credit should be greater than 0!';
	if (form['ChosenYear'] !== undefined && !(await sql.query(`SELECT 1 FROM \`Course\` WHERE \`ID\` = ? AND (\`CancelledYear\` > ? OR \`CancelledYear\` IS NULL)`, [form['CID'], form['ChosenYear']])).length)
		throw 'The course has been cancelled before the chosen year!';
	if (form['CancelledYear'] !== undefined && (await sql.query(`SELECT 1 FROM \`Choose\` WHERE \`CID\` = ? AND \`ChosenYear\` > ?`, [form['ID'], form['CancelledYear']])).length)
		throw 'Some students have chosen the course after the cancelled year!';
	if (!nameMapInit) {
		await Promise.all(Object.keys(nameMap).map(initNameMap));
		nameMapInit = true;
	}
	for (const key in nameMap)
		if (form[key] !== undefined && !nameMap[key].has(form[key]))
			throw `No match for ${key} is found in the database!`;
}

export function objectify(key, value) {
	const res = {};
	res[key] = value;
	return res;
}

export function average(arr) {
	arr = arr.filter(val => val !== null);
	return arr.reduce((acc, cur) => acc + Number(cur), 0) / arr.length;
}

export default { constraintCheck, objectify, average }

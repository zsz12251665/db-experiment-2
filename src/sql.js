import { ipcRenderer } from 'electron'

function where_clause(obj) {
	let res = Object.keys(obj).length ? 'WHERE True' : 'WHERE False';
	for (const key in obj)
		res += ` AND \`${key}\` ${obj[key] === null ? 'IS NULL' : '= ?'}`;
	return res;
}

function where_values(obj) {
	return Object.values(obj).filter(value => value !== null);
}

function query(...args) {
	const identifier = Math.random().toString(36).slice(-8);
	// console.log(identifier, ...args);
	ipcRenderer.send('sql-query', identifier, ...args);
	return new Promise((resolve, reject) => {
		ipcRenderer.on(`sql-result-${identifier}`, (event, res) => resolve(res));
		ipcRenderer.on(`sql-error-${identifier}`, (event, err) => reject(err));
	});
}

function insert(table, obj) {
	const keys = Object.keys(obj), values = Object.values(obj);
	return query(`INSERT INTO \`${table}\` (\`${keys.join('`, `')}\`) VALUES (${values.map(() => '?').join(', ')})`, values);
}

function update(table, obj, column, value) {
	return query(`UPDATE \`${table}\` SET \`${column}\` = ? ${where_clause(obj)}`, [value, ...where_values(obj)]);
}

function remove(table, obj) {
	return query(`DELETE FROM \`${table}\` ${where_clause(obj)}`, where_values(obj));
}

async function exists(table, obj) {
	const res = await query(`SELECT 1 FROM \`${table}\` ${where_clause(obj)}`, where_values(obj));
	return res.length ? true : false;
}

export default { query, insert, update, remove, exists }

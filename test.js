

n = 0;
arr = [20, 21, 22];

function start() {
	return new Promise(function(resolve, reject) {
		resolve([20, null, null]);
	});
}

function createToken([num, prevResolve, prevReject]) {
	return new Promise(function(resolve, reject) {
		const token = num + (n++);

		checkDup(token)
		.then(function(num) {
			if (prevResolve) {
				reject('yea');
				prevResolve(token);
			} else {
				resolve(token);
			}
		})
		.catch(function(err) {
			if (err == 99) {
				console.log("DUP!");
				createToken([num, prevResolve ? prevResolve : resolve, prevReject ? prevReject : reject]).catch(()=>{});
			}
		});

	});

}

function checkDup(num) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			if (arr.indexOf(num) != -1) {
				reject(99);
			} else {
				resolve(num);
			}
		}, 500);
	});
}

start().then(createToken).then(n => console.log(n));

const http = require('http'),
  { exec } = require('child_process');
const { parse } = require('querystring');
const port = 9969;

http.createServer((request, response) => {
  if (request.method === 'POST' && request.url === '/') {
    let body = "";
    request.on('data', (chunk) => {
       body += chunk.toString();
    }).on('end', () => {
	  console.log(parse(body).url);
      exec('java -jar ThumbprintFixer-1.5.jar ' + parse(body).url, (err, stdout, stderr) => {
		console.log({ err, stdout, stderr });
		if (err) {
		  return response.writeHead(500).end(JSON.stringify(err));
		}
		//return response.writeHead(200).end(stdout.substring(0, stdout.length-2));
		return response.writeHead(200).end(stdout.replace(/(\r\n|\n|\r)/gm, ""));
	  });
    });
  } else if (request.method === 'GET' && request.url === '/fetch') {
    response.statusCode = 200;
    response.end("OK");
  } else {
    response.statusCode = 404;
    response.end("Use post and endpoint /");
  }
}).listen(port);
console.log("Listening on port "+port);
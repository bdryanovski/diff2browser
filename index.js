#!/usr/bin/env node
const fs = require('fs')
const Diff2html = require('diff2html');

let input = '';
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(chunk) {input += chunk;});
process.stdin.on('end', function() {
  const diffOptions = {drawFileList: true, outputFormat: 'side-by-side' };
  function handleRequest(request, response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    /* Don't care for the extra spaces into the generated document */
    response.write(`
      <html>
        <style>${fs.readFileSync(`${__dirname}/node_modules/diff2html/bundles/css/diff2html.min.css`, 'utf-8')}</style>
        <style>
         .d2h-files-diff { height: auto; }
         .d2h-info { display: none; }
        </style>
        <body>${Diff2html.html(Diff2html.parse(input), diffOptions)}</body>
      </html>
      `);
    response.end();
  };
  const server = (require('http')).createServer(handleRequest).listen(8000, function() {
    (require('open'))('http://localhost:8000/', {wait: false});
    /* I'm Done and It’s Getting Dark? */
    setTimeout(function() {
      server.close();
      process.exit(0);
    }, 1000);
  });
});

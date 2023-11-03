const net = require("net");

console.log("Logs from your program will appear here!");
const get_method_path_protocol = (str) => {
    const arr = str.split(' ')
    const method = arr[0]
    const path = arr[1]
    const protocol = arr[2]
    return [method,path,protocol]
}
const get_body = (path) => {
    const body = path.split("/")
    return body[2]
}

const server = net.createServer((socket) => {

    socket.on('data', (data) => {
        const lines = data.toString().split('\n')
        const [method,path,protocol]=get_method_path_protocol(lines[0])
        console.log('method:', method, "path:", path, "protocol:", protocol)
        const body=get_body(path)
        console.log('path',path)
        let response=''
        if (path === "/") {
            response="HTTP/1.1 200 OK\r\n\r\n"
        } else if (path.startsWith("/echo")) {
            response=`HTTP/1.1 200 OK\r\n\r\nContent-Type: text/plain\r\n\r\nContent-Length: ${body.length}\r\n\r\n${body}`
        }
        else {
            response="HTTP/1.1 404 Not Found\r\n\r\n"
        }
        console.log(response)
        socket.write(response)
        socket.end()
   })


  socket.on("close", () => {
    socket.end();
    server.close();
  });
});

server.listen(4221, "localhost");

const net = require("net");

console.log("Logs from your program will appear here!");
const get_method_path_protocol = (str) => {
    const arr = str.split(' ')
    const method = arr[0]
    const path = arr[1]
    const protocol = arr[2]
    return [method,path,protocol]
}
const server = net.createServer((socket) => {

    socket.on('data', (data) => {
        const lines = data.toString().split('\n')
        const [method,path,protocol]=get_method_path_protocol(lines[0])
        console.log('method:', method, "path:", path, "protocol:", protocol)
        socket.write("HTTP/1.1 200 OK\r\n\r\n")
        socket.end()
   })


  socket.on("close", () => {
    socket.end();
    server.close();
  });
});

server.listen(4221, "localhost");

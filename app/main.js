const net = require("net");
const { join } = require("path");

console.log("Logs from your program will appear here!");
const get_method_path_protocol = (str) => {
    const arr = str.split(' ')
    const method = arr[0]
    const path = arr[1]
    const protocol = arr[2]
    return [method,path,protocol]
}
const get_body = (path) => {
    const arr = path.split("/")
    const body=[]
    for (let i = 2; i < arr.length; i++){
        body.push(arr[i])
    }
    return body.join("/")
}
function get_user_agent(user_agent) {
    const arr = user_agent.split(":")
    return arr[1]
  }
const server = net.createServer((socket) => {

    socket.on('data', (data) => {
        const lines = data.toString().split('\n')
        const [method, path, protocol] = get_method_path_protocol(lines[0])
        console.log('useragent',lines[2])
        console.log('method:', method, "path:", path, "protocol:", protocol)
        const body = get_body(path)
        const user_agent=get_user_agent(lines[2])
        console.log('path',path)
        let response=''
        if (path === "/") {
            response="HTTP/1.1 200 OK\r\n\r\n"
        } else if (path.startsWith("/echo/")) {
            response=`HTTP/1.1 200 OK\r\n\Content-Type: text/plain\r\n\Content-Length: ${body.length}\r\n\r\n${body}`
        } else if (path.startsWith("/user-agent")) {
            response=`HTTP/1.1 200 OK\r\n\Content-Type: text/plain\r\n\Content-Length: ${user_agent.length}\r\n\r\n${user_agent}`
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

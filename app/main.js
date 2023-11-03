const net = require("net");
const fs = require('fs');
const path = require("path");

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
    if (arr[1]) {
        return arr[1].replace(/\s/g, '')
    } else {
        return ""
    }
}
function get_directory_path() {
    const arr = process.argv.slice(2)
  const i = arr.indexOf("--directory")
  const directory_path=arr[i+1]
  return directory_path
}
    
const get_file_content = (url) => {
    const filename = url.substring(7)
    const directory_path = get_directory_path()
    const file_path=path.join(directory_path,filename)
    const file_content = fs.readFileSync(file_path)
    return file_content
}
const server = net.createServer((socket) => {

    socket.on('data', (data) => {
        const lines = data.toString().split('\n')
        const [method, path, protocol] = get_method_path_protocol(lines[0])
        const body = get_body(path)
        const user_agent = get_user_agent(lines[2])
        const file_content=get_file_content(path)
        let response=''
        if (path === "/") {
            response="HTTP/1.1 200 OK\r\n\r\n"
        } else if (path.startsWith("/echo/")) {
            response=`HTTP/1.1 200 OK\r\n\Content-Type: text/plain\r\n\Content-Length: ${body.length}\r\n\r\n${body}`
        } else if (path.startsWith("/user-agent")) {
            response=`HTTP/1.1 200 OK\r\n\Content-Type: text/plain\r\n\Content-Length: ${user_agent.length}\r\n\r\n${user_agent}`
        } else if (path.startsWith("/files") && method === "GET") {
            response=`HTTP/1.1 200 OK\r\n\Content-Type: application/octet-stream\r\n\Content-Length: ${file_content.length}\r\n\r\n${file_content}`

        }
        else {
            response="HTTP/1.1 404 Not Found\r\n\r\n"
        }
        socket.write(response)
        socket.end()
   })


  socket.on("close", () => {
    socket.end();
  });
});

server.listen(4221, "localhost");

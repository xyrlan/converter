const { spawn } = require("child_process");

/** @type {import('next').NextConfig} */
const nextConfig = {
    async afterBuild() {
        console.log("Executando o script de conversão...");
        const childProcess = spawn("node", ["dist/converter/index.js"]);

        childProcess.stdout.on("data", (data) => {
            console.log(`Saída do script: ${data}`);
        });

        childProcess.stderr.on("data", (data) => {
            console.error(`Erro no script: ${data}`);
        });

        childProcess.on("close", (code) => {
            console.log(`O script foi executado com código de saída: ${code}`);
        });
    },
}

module.exports = nextConfig

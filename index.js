import os from "os"
import cluster from "cluster"
import express from "express"
import { time } from "console"


const numCpus = os.cpus().length
const target = 1e8
const chunkSize = Math.floor(target / numCpus) //target/numCpus 

console.log("Starting Process");
if(cluster.isPrimary){
    let startTime = Date.now()
    let totalSum = 0
    let comepletedWorkers = 0
    for(let i = 0; i < numCpus; i++){
        const worker = cluster.fork()
        const start = i*chunkSize
        const end = start + chunkSize
        setTimeout(() => {
            worker.send({start, end})
        },100)
        
        worker.on("message", (result) => {
            totalSum += result
            comepletedWorkers++
            if(comepletedWorkers === numCpus){
                const endTime = Date.now()
                console.log(`Total Sum: ${totalSum}`)
                console.log(`Time Taken: ${endTime - startTime}`)
            }
        })
    }
}
else{
    process.on("message", ({start, end}) => {
        let sum = 0
        for(let i = start; i < end; i++){
            sum += i
        }
        process.send(sum)
    })
}



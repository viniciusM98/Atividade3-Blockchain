/*
  Código baseado nos videos do canal Simply Explained
  https://www.youtube.com/watch?v=zVqczFZr124
  https://www.youtube.com/watch?v=HneatE69814 

  UTILIZAR COMANDO NPM INSTALL ANTES DE EXECUTAR
*/

const SHA256 = require('crypto-js/sha256') // CRYPTO JS para calcular o hash
const readline = require('readline-sync')

class Block{
  constructor(index, timestamp, data, previousHash = ''){
    this.index = index
    this.timestamp = timestamp
    this.data = data
    this.previousHash = previousHash
    this.hash = this.calculateHash();
    this.nonce = 0
  }

  // index - mostra onde o bloco está na corrente
  // timestamp - quando o bloco foi criado
  // data - qualquer tipo de dados que você quiser associar ao bloco (detalhes de uma transação, sender/receiver)
  // previousHash - String que contém o hash do bloco anterior
  // O HASH do bloco vai ser calculado

  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  // A biblioteca SHA256 retorna um objeto, logo é necessário convertê-la para string
  mineBlock(difficulty){
    // TAMANHO DE ZEROS IGUAL A DIFICULDADE
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
      this.nonce++
      this.hash = this.calculateHash()
    }

    console.log(`Block mined: ${this.hash}`)
  }
}

// Proof-of-Work -> Utilizar poderes computacionais para criação de um bloco
// Mining


class Blockchain{
  // O construtor é responsável por inicializar o blockchain
  constructor(){
    this.chain = [this.createGenesisBlock()] // CHAIN - Array de blocos
    //this.difficulty = 2
  }

  // O primeiro bloco em um blockchain é denominado genesis block e deve ser criado de forma manual
  createGenesisBlock(){
    return new Block(0, "13/05/2021", "Genesis block", "0")
  }

  //Método que retorna o último bloco da nossa chain
  getLatestBlock(){
    return this.chain[this.chain.length - 1]
  }

  // Responsável por adicionar um novo bloco na chain
  addBlock(newBlock){
    newBlock.previousHash = this.getLatestBlock().hash // Armazena o último hash do último na variável previousHash do novo bloco

    let difficulty = readline.question("Digite a dificuldade:\n")
    newBlock.mineBlock(parseInt(difficulty))
    this.chain.push(newBlock);
  }

  // Método que verifica a integridade da chain
  isChainValid(){
    for(let i = 1; i < this.chain.length; i++){
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i-1]

      // Se a hash armazeanda no meu bloco não for igual a hash calculada, algo está errado...
      if(currentBlock.hash !== currentBlock.calculateHash()){
        return false
      }

      // Se o bloco atual não apontar para o bloco anterior, algo está errado...
      if(currentBlock.previousHash !== previousBlock.hash){
        return false
      }
    }

    return true
  }
}

let viniCoin = new Blockchain()
let quantidade_blocos
let content
let data

quantidade_blocos = parseInt(readline.question("Digite a quantidade de blocos:\n"))
for(let i = 1; i <= quantidade_blocos; i++){
  console.log(`Mining block ${i}...`)
  data = readline.question(`Digite a data do bloco ${i} no formato: dd/mm/aaaa:\n`)
  while(true){
    content = parseInt(readline.question(`Digite a quantidade de coins do bloco ${i}:\n`))
    if(content < 0){
      console.log('Alguma coisa está errada...\n')
    } else{
      break
    }
  }

  viniCoin.addBlock(new Block(i, data, { amount: content }))
}

console.log(JSON.stringify(viniCoin, null, 2))
console.log(`O blockchain é valido? ${viniCoin.isChainValid()}`)

// Quando um blockchain é adicionado, ele não pode ser modificado sem invalidar o resto da chain
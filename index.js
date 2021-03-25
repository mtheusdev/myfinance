const { prisma } = require('./generated/prisma-client')

async function main(){
  await prisma.createUser({
    name: 'Matheus Henrique',
    email: 'matheus@gmail.com',
    password: '123'
  })

  const users = await prisma.users()

  console.log(users)

}

main().catch(err => console.error(err))
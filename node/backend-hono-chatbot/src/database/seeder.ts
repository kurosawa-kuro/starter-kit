import { prisma } from './client.js'

async function main() {
  const users = [
    { name: '佐藤 美咲' },
    { name: '田中 健一' },
    { name: '鈴木 陽子' },
    { name: '山田 太郎' },
    { name: '伊藤 さくら' },
    { name: '渡辺 翔太' },
    { name: '高橋 優子' },
    { name: '中村 大輔' },
    { name: '小林 花子' },
    { name: '加藤 隆司' }
  ]

  console.log('🌱 データベースのシードを開始します...')

  for (const user of users) {
    await prisma.user.create({
      data: user
    })
  }

  console.log('✅ シードが完了しました')
}

main()
  .catch((e) => {
    console.error('❌ シードに失敗しました:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
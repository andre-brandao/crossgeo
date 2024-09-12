// import { faker } from '@faker-js/faker'
import { map, user } from './controller'
import Papa from 'papaparse'
import fs from 'fs'
import { generateId } from 'lucia'
import { hash } from '@node-rs/argon2'

const main = async () => {
  const userId = await seedUsers()
  if(userId){
    await seedDatasetTest(userId)
  } else {
    console.error('User id nao encontrado')
  }
}
main()

async function seedUsers() {
  console.log('userTable seed START')
  try {
    const [userId] = await user.insertUser({
      id: generateId(15),
      username: 'administrator',
      email: 'admin@admin.com',
      phone: '32132131',
      password_hash: await hash('senha123', {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      }),
    }).returning()

    return userId.id
  } catch (error) {
    console.error('Failed to insert administrator:', error)
  }

  console.log('userTable seed END')
}

async function seedDatasetTest(userId:string) {
  let csv_headers: string[] = []
  let csv_data: any[] = []

  const csvText = fs.readFileSync('static/geo_data/olympics.csv', 'utf8')
  Papa.parse(csvText, {
    header: true,
    dynamicTyping: true,
    complete: function (result) {
      if (result.meta.fields) {
        csv_headers = result.meta.fields
      }
      csv_data = result.data
      // parsedHeaders(headers)
    },
    error: function (error: any) {
      console.error('Error parsing the CSV:', error)
    },
  })

  try {
    const [newMapData] = await map
      .insertData({
        created_by: userId,
        name: 'Olympics example dataset',
        fields_info: {
          lat_field: 'lat',
          long_field: 'long',
          fields: csv_headers,
        },
      })
      .returning()

    console.log(newMapData)
    const points = csv_data.map(point => ({
      lat: point.lat,
      long: point.long,
      data_id: newMapData.id,
      meta_data: point,
    }))
    console.log(points)
    await map.insertPoints(points)
  } catch (error) {
    console.error(error)
  }
}

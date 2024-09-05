import { SNS } from '@aws-sdk/client-sns'
import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
} from '$env/static/private'

export async function sendSMS(
  number: string,
  message: string,
  subject: string,
) {
  const sns = new SNS({
    region: AWS_REGION,

    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  })

  const params = {
    Message: message,
    PhoneNumber: number,
    // MessageAttributes: {
    //   'AWS.SNS.SMS.SenderID': {
    //     DataType: 'String',
    //     StringValue: subject,
    //   },
    //   // 'AWS.SNS.SMS.SMSType': {
    //   //   DataType: 'String',
    //   //   StringValue: 'Transactional',
    //   // },
    // },
  }
  console.log(params)

  const result = await sns.publish(params)

  console.log(result)

  return result
}

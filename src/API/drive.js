let { google } = require('googleapis');
let key = require("./server.json");
const File = require('../dataBase/models/File')
const Patient = require('../dataBase/models/Patient')
const fs = require('fs')
const moment = require('moment')
const PrescriptionID = '1rTiw-ko1Fhos7CDT27qXyHcFQA5ZOXRr7lq6jPCX5MA'

const jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/drive'],
  null
)
//authenticate request

const imageUpload = async (patientId, photoPath, auth) =>
{


  const drive = google.drive({ version: 'v3', auth });



  var folderId = await createOrGetFolder(patientId, auth);
  var fileMetadata = {
    'name': new Date().toDateString() + '.jpg',
    parents: [folderId]
  };

  var media = {
    mimeType: 'image/jpeg',
    body: fs.createReadStream(photoPath)
  };


  try
  {

    const res = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    })

  } catch (error)
  {

    console.log('error')
  }

}

const createOrGetFolder = async (patientId, auth) =>
{

  try
  {
    var fileId = await File.findOne({ patientId })

    if (fileId === null)
    {


      const p = await Patient.findById(patientId)
      const drive = google.drive({ version: 'v3', auth });

      var folderId = '1E5K-rDIDZj6TC0naYSOcIuUBK0PBqyGm';
      var fileMetadata = {
        'name': p.name,
        'mimeType': 'application/vnd.google-apps.folder',
        parents: [folderId]
      };

      const res = await drive.files.create({
        resource: fileMetadata,
        fields: 'id'
      })


      fileId = await new File({ patientId, fileId: res.data.id }).save()


    }
    return fileId.fileId

  } catch (error)
  {
    console.log(error)
  }




}

const copyFile = async (patientFolderId, copyId, name, auth) =>
{
  const drive = google.drive({ version: 'v3', auth });

  try
  {
    const res = await drive.files.copy({
      fileId: copyId,
      requestBody: {
        name: name + new Date().toDateString(),
        parents: ['16RFurK7jJjE72P_Ny8i61F135AHOpDlU']

      },
    })


    const ans = await drive.files.update({
      fileId: res.data.id,
      addParents: patientFolderId,
      removeParents: '16RFurK7jJjE72P_Ny8i61F135AHOpDlU',
      fields: 'id, parents'
    })


    return ans.data.id
  } catch (error)
  {

    console.log(error)
  }
}


const makeNormalDocs = async (data, auth) =>
{



  let patientFolderId = await createOrGetFolder(data[0], auth), copyId = PrescriptionID, name = data[1], cat = data[2]


  let docName = 'Prescription'
  if (data[3] == 'xray')
    docName = 'Xray'
  else if (data[3] == 'inv')
    docName = "Investigation"
    else if( data[3] == 'physio')
    docName = "Physiotherapy"

  let docId = await copyFile(patientFolderId, copyId, docName, auth)


  try
  {
    const docs = google.docs({ version: 'v1', auth });

    let array = []

    for (let i = 0; i < data.length; i++)
    {



      if (i > 4) 
      {



        const space = (data[3] == 'pre') ? '\n' : '\n \n'
        array.push(data[i] + space)
        console.log(space)


      }
    }

    let date = moment(data[4]).format('DD/MM/YYYY').toString()


    let finalArr = [{

      replaceAllText: {
        containsText: {
          text: '*name*',
          matchCase: true,
        },
        replaceText: name,
      },

    },
    {

      replaceAllText: {
        containsText: {
          text: '*cat*',
          matchCase: true,
        },
        replaceText: cat,
      },

    },
    {

      replaceAllText: {
        containsText: {
          text: '*date*',
          matchCase: true,
        },
        replaceText: moment().format('DD/MM/YYYY').toString()
      },

    },
    {

      replaceAllText: {
        containsText: {
          text: '*dateCon*',
          matchCase: true,
        },
        replaceText: date
      },

    },

    ]


    let len = 76 + name.length + moment().format('DD/MM/YYYY').toString().length + date.length + cat.length
    for (let i = 0; i < array.length; i++)
    {

      finalArr.push({ insertText: { location: { index: len }, text: array[i] } })


      finalArr.push({
        updateParagraphStyle: {
          paragraphStyle: {

            direction: (i % 2 == 0 || data[3] != 'pre') ? "LEFT_TO_RIGHT" : "RIGHT_TO_LEFT",
            alignment: "JUSTIFIED",
            spaceBelow: {
              "magnitude": 0,
              "unit": "PT"
            },


          },
          range: {
            startIndex: len,
            endIndex: len + array[i].length
          },

          fields: "direction , alignment,spaceBelow "
        }
      })


      finalArr.push({
        updateTextStyle: {

          textStyle: {
            bold: false,
            fontSize: {
              "magnitude": (i % 2 == 0 || data[3] !== 'pre') ? 19 : 16,
              "unit": "PT"
            },
            weightedFontFamily: {
              fontFamily: 'Calibri',
              weight: 400
            }
          },
          range: {
            startIndex: len,
            endIndex: len + array[i].length
          },
          fields: "bold , fontSize , weightedFontFamily"

        }
      })



      len += array[i].length
    }

    const res = await docs.documents.batchUpdate({
      documentId: docId,
      requestBody: {
        requests: finalArr
      }
    })



    return res.data.documentId


  } catch (error)
  {

    console.log(error)
  }
}

const makeSpecialDocs = async (data, auth) =>
{
  let patientFolderId = await createOrGetFolder(data[0], auth), copyId = data[2], name = data[1]
  let docId = await copyFile(patientFolderId, copyId, data[3], auth)


  try
  {

    const docs = google.docs({ version: 'v1', auth });
    let finalArr = [{

      replaceAllText: {
        containsText: {
          text: '*name*',
          matchCase: true,
        },
        replaceText: name,
      },

    },

    {

      replaceAllText: {
        containsText: {
          text: '*date*',
          matchCase: true,
        },
        replaceText: moment().format('DD/MM/YYYY').toString()
      },

    },


    ]

    const res = await docs.documents.batchUpdate({
      documentId: docId,
      requestBody: {
        requests: finalArr
      }
    })

    return res.data.documentId
  } catch (error)
  {
    console.log(error)
  }



}

module.exports = { imageUpload, createOrGetFolder, jwtClient, makeNormalDocs , makeSpecialDocs};



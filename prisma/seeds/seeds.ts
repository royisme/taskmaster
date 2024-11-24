// prisma/seed.ts
import { PrismaClient, SchoolType } from '@prisma/client'


const prisma = new PrismaClient()

const school_list = [
  // Universities
  { name: "Algoma University", type: SchoolType.University, domain: "algomau.ca" },
  { name: "Brock University", type: SchoolType.University, domain: "brocku.ca" },
  { name: "Carleton University", type: SchoolType.University, domain: "carleton.ca" },
  { name: "Lakehead University", type: SchoolType.University, domain: "lakeheadu.ca" },
  { name: "Laurentian University", type: SchoolType.University, domain: "laurentian.ca" },
  { name: "McMaster University", type: SchoolType.University, domain: "mcmaster.ca" },
  { name: "Nipissing University", type: SchoolType.University, domain: "nipissingu.ca" },
  { name: "OCAD University", type: SchoolType.University, domain: "ocadu.ca" },
  { name: "Queen's University", type: SchoolType.University, domain: "queensu.ca" },
  { name: "Royal Military College of Canada", type: SchoolType.University, domain: "rmc-cmr.ca" },
  { name: "Toronto Metropolitan University", type: SchoolType.University, domain: "torontomu.ca" },
  { name: "Trent University", type: SchoolType.University, domain: "trentu.ca" },
  { name: "University of Guelph", type: SchoolType.University, domain: "uoguelph.ca" },
  { name: "University of Ottawa", type: SchoolType.University, domain: "uottawa.ca" },
  { name: "University of Toronto", type: SchoolType.University, domain: "utoronto.ca" },
  { name: "University of Waterloo", type: SchoolType.University, domain: "uwaterloo.ca" },
  { name: "University of Windsor", type: SchoolType.University, domain: "uwindsor.ca" },
  { name: "Western University", type: SchoolType.University, domain: "uwo.ca" },
  { name: "Wilfrid Laurier University", type: SchoolType.University, domain: "wlu.ca" },
  { name: "York University", type: SchoolType.University, domain: "yorku.ca" },

  // Colleges
  { name: "Algonquin College", type: SchoolType.College, domain: "algonquincollege.com" },
  { name: "Cambrian College", type: SchoolType.College, domain: "cambriancollege.ca" },
  { name: "Canadore College", type: SchoolType.College, domain: "canadorecollege.ca" },
  { name: "Centennial College", type: SchoolType.College, domain: "centennialcollege.ca" },
  { name: "Collège Boréal", type: SchoolType.College, domain: "collegeboreal.ca" },
  { name: "Conestoga College", type: SchoolType.College, domain: "conestogac.on.ca" },
  { name: "Confederation College", type: SchoolType.College, domain: "confederationcollege.ca" },
  { name: "Durham College", type: SchoolType.College, domain: "durhamcollege.ca" },
  { name: "Fanshawe College", type: SchoolType.College, domain: "fanshawec.ca" },
  { name: "Fleming College", type: SchoolType.College, domain: "flemingcollege.ca" },
  { name: "George Brown College", type: SchoolType.College, domain: "georgebrown.ca" },
  { name: "Georgian College", type: SchoolType.College, domain: "georgiancollege.ca" },
  { name: "Humber College", type: SchoolType.College, domain: "humber.ca" },
  { name: "La Cité collégiale", type: SchoolType.College, domain: "lacitec.on.ca" },
  { name: "Lambton College", type: SchoolType.College, domain: "lambtoncollege.ca" },
  { name: "Loyalist College", type: SchoolType.College, domain: "loyalistcollege.com" },
  { name: "Mohawk College", type: SchoolType.College, domain: "mohawkcollege.ca" },
  { name: "Niagara College", type: SchoolType.College, domain: "niagaracollege.ca" },
  { name: "Northern College", type: SchoolType.College, domain: "northerncollege.ca" },
  { name: "Sault College", type: SchoolType.College, domain: "saultcollege.ca" },
  { name: "Seneca College", type: SchoolType.College, domain: "senecacollege.ca" },
  { name: "Sheridan College", type: SchoolType.College, domain: "sheridancollege.ca" },
  { name: "St. Clair College", type: SchoolType.College, domain: "stclaircollege.ca" },
  { name: "St. Lawrence College", type: SchoolType.College, domain: "stlawrencecollege.ca" },
]

async function main() {
  console.log('Start seeding schools...')
  
  for (const school of school_list) {
    const result = await prisma.school.upsert({
      where: { domain: school.domain },
      update: {
        name: school.name,
        type: school.type
      },
      create: {
        name: school.name,
        type: school.type,
        domain: school.domain
      }
    })
    console.log(`Created/Updated school: ${result.name}`)
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "theo@overmind.xyz";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("overmind", 10);

  await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      profile: {
        create: {
          firstname: "Theodore",
          lastname: "Garson",
          pseudonym: "theodoregc",
          country: "Singapore",
          rank: "five",
        },
      },
    },
  });

  await prisma.blueprint.create({
    data: {
      title: "The Sum Challenge",
      description:
        "In this challenge, you'll be given two randomly generated integer values between 1 and 1000. Your task is to add these two numbers together to find the solution. Each user will receive their own unique set of input values, so no two solutions will be the same. Put your math skills to the test and see if you can find the correct answer to the sum challenge!",
      difficulty: "easy",
      inputGenerator: {
        value: (() => {
          const min = 1;
          const max = 1000;
          const num1 = Math.floor(Math.random() * (max - min + 1) + min);
          const num2 = Math.floor(Math.random() * (max - min + 1) + min);

          return [num1, num2];
        }).toString(),
      },
      solutionGenerator: {
        value: ((input: number[]) =>
          input.reduce((acc, num) => acc + num, 0)).toString(),
      },
    },
  });

  await prisma.blueprint.create({
    data: {
      title: "The Sorting Challenge",
      description:
        "In this challenge, you'll be given 500 randomly generated integer values between 1 and 1000, separated by a single space. Your task is to sort these numbers in descending order and return the integer located in the 300th position as your solution. Each user will receive their own unique set of input values, so no two solutions will be the same. Test your sorting skills and see if you can find the correct answer to the sorting challenge!",
      difficulty: "medium",
      inputGenerator: {
        value: (() => {
          const inputs = [];

          for (let i = 0; i < 500; ++i) {
            inputs.push(Math.floor(Math.random() * 1000) + 1);
          }

          return inputs.join(" ");
        }).toString(),
      },
      solutionGenerator: {
        value: ((input: string) => {
          const inputs = input.split(" ").map((num) => parseInt(num));

          inputs.sort((a, b) => b - a);

          return inputs[299];
        }).toString(),
      },
    },
  });

  await prisma.blueprint.create({
    data: {
      title: "Converting Celsius to Fahrenheit",
      description:
        "Each user has a dynamically generated input value (integer between -100 and 100) (values are randomly generated for each user). The user must convert the Celsius input to Fahrenheit to get their solution.",
      difficulty: "easy",
      inputGenerator: {
        value: (() => {
          const celsius = Math.floor(Math.random() * 201) - 100;

          return celsius;
        }).toString(),
      },
      solutionGenerator: {
        value: ((input: string) => {
          const celsius = Number(input);
          const fahrenheit = (celsius * 9) / 5 + 32;

          return fahrenheit;
        }).toString(),
      },
    },
  });

  await prisma.blueprint.create({
    data: {
      title: "Multiplying three integers",
      description:
        "Each user has three dynamically generated input values (integer between 1-100) (values are randomly generated for each user). The user must multiply the input values to get their solution.",
      difficulty: "medium",
      inputGenerator: {
        value: (() => {
          const num1 = Math.floor(Math.random() * 100) + 1;
          const num2 = Math.floor(Math.random() * 100) + 1;
          const num3 = Math.floor(Math.random() * 100) + 1;

          return [num1, num2, num3];
        }).toString(),
      },
      solutionGenerator: {
        value: ((input: number[]) =>
          input.reduce((acc, num) => acc * num, 1)).toString(),
      },
    },
  });

  await prisma.blueprint.create({
    data: {
      title: "Prime Triplet Sum",
      description:
        "Find the sum of three prime numbers that add up to a given number. The three primes must be unique and in ascending order.",
      difficulty: "hard",
      inputGenerator: {
        value: (() => {
          const max = 3000;
          const sum = Math.floor(Math.random() * max) + 1;

          return sum;
        }).toString(),
      },
      solutionGenerator: {
        value: ((input: number) => {
          const isPrime = (num: number) => {
            for (let i = 2; i <= Math.sqrt(num); ++i) {
              if (num % i === 0) return false;
            }

            return num > 1;
          };

          let primeSum = 0;

          for (let i = 2; i < input / 3; ++i) {
            if (isPrime(i)) {
              for (let j = i + 1; j < input / 2; ++j) {
                if (isPrime(j)) {
                  for (let k = j + 1; k < input; ++k) {
                    if (isPrime(k) && i + j + k === input) {
                      primeSum = i + j + k;
                      return primeSum;
                    }
                  }
                }
              }
            }
          }
        }).toString(),
      },
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

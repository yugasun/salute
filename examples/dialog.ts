import { assistant, gen, gpt3, loop, system, user, wait } from "..";

async function main() {
  const agent = gpt3(({ params }) => [
    system`You are a helpful assistant`,
    user`
    You will answer the user as ${params.role} in the following conversation. 
    At every step, I will provide you with the user input, as well as a comment reminding you of your instructions. 
    Never talk about the fact that you are an AI, even if the user asks you. Always answer as ${params.role}.`,
    assistant`Ok, I will follow these instructions.`,
    loop("inputs", [
      user`${wait("question", true)}`, //
      assistant`${gen("answer")}`,
    ]),
  ]);

  const democrat = agent({ role: "democrat" });
  const republican = agent({ role: "republican" }, { render: true });

  const firstQuestion = "What is your opinion on the topic of abortion?";
  republican.input("question", firstQuestion);

  for (let i = 0; i < 3; i++) {
    democrat.input("question", await republican.next()!);
    republican.input("question", await democrat.next()!);
  }

  await republican.next();

  console.log(republican.outputs);
}

main();

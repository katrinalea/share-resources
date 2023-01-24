import { formatTags } from "./formatTags";

const tags = [
  '{"React","Typescript","Javascript","Front-end","Back-end","CSS","HTML","SQL"}',
];

test("formatTags gets rid of curly braces and returns an array", () => {
  expect(formatTags(tags)).toStrictEqual([
    "React",
    "Typescript",
    "Javascript",
    "Front-end",
    "Back-end",
    "CSS",
    "HTML",
    "SQL",
  ]);
});

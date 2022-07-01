import yaml from "js-yaml";
import fs from "fs";
import path from "path";

const getYaml = async () => {
  try {
    const json = await yaml.load(
      fs.readFileSync(path.join(__dirname, "../string.yml"), "utf-8")
    );
    fs.writeFileSync(
      path.join(__dirname, "../string.yml.json"),
      JSON.stringify(json)
    );
  } catch (error) {
    console.log(error);
  }
};

export default getYaml;

export async function getData() {
  try {
    const data = await fetch("https://corona-api.com/countries");
    const yea = await data.json();
    return yea;
  } catch (error) {
    console.log(error);
  }
}
getData();
//data from corona tracek
console.log();

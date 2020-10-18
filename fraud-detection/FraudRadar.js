const fs = require("fs");

function Check(filePath) {
  // READ FRAUD LINES
  let orders = ReadFraudFile(filePath);

  // NORMALIZE
  let normalizedOrders = Normalizations(orders);

  // CHECK FRAUD
  let fraudResults = [];

  for (let i = 0; i < orders.length; i++) {
    let current = orders[i];
    let isFraudulent = false;

    for (let j = i + 1; j < normalizedOrders.length; j++) {
      isFraudulent = false;
      if (
        current.dealId === normalizedOrders[j].dealId &&
        current.email === normalizedOrders[j].email &&
        current.creditCard !== normalizedOrders[j].creditCard
      ) {
        isFraudulent = true;
      }

      if (
        current.dealId === normalizedOrders[j].dealId &&
        current.state === normalizedOrders[j].state &&
        current.zipCode === normalizedOrders[j].zipCode &&
        current.street === normalizedOrders[j].street &&
        current.city === normalizedOrders[j].city &&
        current.creditCard !== normalizedOrders[j].creditCard
      ) {
        isFraudulent = true;
      }

      if (isFraudulent) {
        fraudResults.push({
          isFraudulent: true,
          orderId: normalizedOrders[j].orderId,
        });
      }
    }
  }

  return fraudResults;
}

function ReadFraudFile(filePath) {
  let orders = [];
  let fileContent = fs.readFileSync(filePath, "utf8");
  let lines = fileContent.split("\n");
  for (let line of lines) {
    let items = line.split(",");
    let order = {
      orderId: Number(items[0]),
      dealId: Number(items[1]),
      email: items[2].toLowerCase(),
      street: items[3].toLowerCase(),
      city: items[4].toLowerCase(),
      state: items[5].toLowerCase(),
      zipCode: items[6],
      creditCard: items[7],
    };
    orders.push(order);
  }
  return orders;
}

function Normalizations(orders) {
  for (let order of orders) {
    // Normalize email
    let aux = order.email.split("@");
    let atIndex = aux[0].indexOf("+");
    aux[0] =
      atIndex < 0
        ? aux[0].replace(".", "")
        : aux[0].replace(".", "").substring(0, atIndex - 1);
    order.email = aux.join("@");

    // Normalize street
    order.street = order.street.replace("st.", "street").replace("rd.", "road");

    // Normalize state
    order.state = order.street
      .replace("il", "illinois")
      .replace("ca", "california")
      .replace("ny", "new york");
  }
  return orders;
}

module.exports = { Check };

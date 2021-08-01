import React, { useEffect, useState } from "react";
import { Contract } from "@ethersproject/contracts";
// import { getDefaultProvider } from "@ethersproject/providers";
// import { ethers } from "ethers";
// import { useQuery } from "@apollo/react-hooks";

import { Body, Button, Header } from "./components";
import useWeb3Modal from "./hooks/useWeb3Modal";

import { addresses, abis } from "@project/contracts";
// import GET_TRANSFERS from "./graphql/subgraph";

function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
  return (
    <Button
      onClick={() => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      {!provider ? "Connect Wallet" : "Disconnect Wallet"}
    </Button>
  );
}

function App() {
  // const { loading, error, data } = useQuery(GET_TRANSFERS);
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [signer, setSigner] = useState();
  const [message, setMessage] = useState({});
  const [temp, setTemp] = useState("");
  const [hum, setHum] = useState("");
  const [lightExpo, setLightExpo] = useState("");
  const [seedDetails, setSeedDetails] = useState({});
  const [transaction, setTransaction] = useState(false);
  const [voilationDetails, setVoilationDetails] = useState();

  // React.useEffect(() => {
  //   if (!loading && !error && data && data.transfers) {
  //     console.log({ transfers: data.transfers });
  //   }
  // }, [loading, error, data]);

  const contractInstance = (providerOrSigner) => {
    const storageContract = new Contract(
      addresses.contractStorageAddress,
      abis.storage,
      providerOrSigner
    );
    return storageContract;
  };

  const addSeed = async () => {
    const contract = contractInstance(signer);
    contract
      .addSeed(
        seedDetails.seedName,
        seedDetails.batchId,
        seedDetails.quantity,
        seedDetails.price,
        seedDetails.optimumTemp,
        seedDetails.optimumHum,
        seedDetails.optimumLightExpo
      )
      .then((res) => console.log(res));
  };

  const triggerTempVoilation = async () => {
    if (temp) {
      const contract = contractInstance(signer);
      await contract.temperatureSelfCheck(temp).then((res) => console.log(res));
      contract.once(
        "TemperatureViolation",
        (address, msg, actualTemp, optimumTemp) => {
          setVoilationDetails({
            address,
            msg,
            actual: actualTemp,
            optimum: optimumTemp,
          });
          setTransaction(false);
        }
      );
      setTemp("");
      setTransaction(true);
    } else {
      setMessage({ ...message, temp: "Please enter temperature" });
    }
  };

  const triggerHumVoilation = async () => {
    if (hum) {
      const contract = contractInstance(signer);
      await contract.hummiditySelfCheck(hum).then((res) => console.log(res));
      contract.once(
        "HummidityViolation",
        (address, msg, actualHum, optimumHum) => {
          setVoilationDetails({
            address,
            msg,
            actual: actualHum,
            optimum: optimumHum,
          });
          setTransaction(false);
        }
      );
      setHum("");
      setTransaction(true);
    } else {
      setMessage({ ...message, hum: "Please enter humidity" });
    }
  };

  const triggerLightExpoVoilation = async () => {
    if (lightExpo) {
      const contract = contractInstance(signer);
      await contract
        .lightExpoSelfCheck(lightExpo)
        .then((res) => console.log(res));
      contract.once(
        "LightExposureViolation",
        (address, msg, actualLightExpo, optimumLightExpo) => {
          setVoilationDetails({
            address,
            msg,
            actual: actualLightExpo,
            optimum: optimumLightExpo,
          });
          setTransaction(false);
        }
      );
      setLightExpo("");
      setTransaction(true);
    } else {
      setMessage({ ...message, lightExpo: "Please enter Light Exposure" });
    }
  };

  useEffect(() => {
    if (provider) {
      const signer = provider.getSigner();
      setSigner(signer);
    }
  }, [provider]);

  const tempChange = (e) => {
    setMessage({
      ...message,
      temp: null,
    });
    setVoilationDetails();
    setTemp(e.target.value);
  };

  const humChange = (e) => {
    setMessage({
      ...message,
      hum: null,
    });
    setVoilationDetails();
    setHum(e.target.value);
  };

  const lightExpoChange = (e) => {
    setMessage({
      ...message,
      lightExpo: null,
    });
    setVoilationDetails();
    setLightExpo(e.target.value);
  };

  const seedNameChange = (e) => {
    setSeedDetails({
      ...seedDetails,
      seedName: e.target.value,
    });
  };

  const batchIdChange = (e) => {
    setSeedDetails({
      ...seedDetails,
      batchId: e.target.value,
    });
  };

  const quantityChange = (e) => {
    setSeedDetails({
      ...seedDetails,
      quantity: e.target.value,
    });
  };

  const priceChange = (e) => {
    setSeedDetails({
      ...seedDetails,
      price: e.target.value,
    });
  };

  const optimumTempChange = (e) => {
    setSeedDetails({
      ...seedDetails,
      optimumTemp: e.target.value,
    });
  };

  const optimumHumChange = (e) => {
    setSeedDetails({
      ...seedDetails,
      optimumHum: e.target.value,
    });
  };

  const optimumLightExpoChange = (e) => {
    setSeedDetails({
      ...seedDetails,
      optimumLightExpo: e.target.value,
    });
  };

  const voilationInfo = (info) => {
    return (
      <div style={{ margin: "20px" }}>
        {`Storage Address:  ${info?.address} `}
        <br />
        {`Message: ${info?.msg}`}
        <br />
        {`Actual: ${info?.actual}`}
        <br />
        {`Optimum: ${info?.optimum}`}
      </div>
    );
  };

  return (
    <div>
      <Header>
        <WalletButton
          provider={provider}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
        />
      </Header>
      <Body>
        <div>
          <div
            style={{ display: "flex", flexDirection: "column", margin: "20px" }}
          >
            <input
              value={seedDetails?.seedName}
              onChange={seedNameChange}
              placeholder="Seed Name"
            />
            <input
              value={seedDetails?.batchId}
              onChange={batchIdChange}
              placeholder="Batch ID"
            />
            <input
              value={seedDetails?.quantity}
              onChange={quantityChange}
              placeholder="Quantity"
            />
            <input
              value={seedDetails?.price}
              onChange={priceChange}
              placeholder="Price"
            />
            <input
              value={seedDetails?.optimumTemp}
              onChange={optimumTempChange}
              placeholder="Optimum Temparature"
            />
            <input
              value={seedDetails?.optimumHum}
              onChange={optimumHumChange}
              placeholder="Optimum Humidity"
            />
            <input
              value={seedDetails?.optimumLightExpo}
              onChange={optimumLightExpoChange}
              placeholder="Optimum Light Exposure"
            />
          </div>

          <Button style={{ maxWidth: "100%" }} onClick={() => addSeed()}>
            Add Seed
          </Button>
          <div>
            <div style={{ display: "flex", margin: "20px" }}>
              <input
                value={temp}
                onChange={tempChange}
                placeholder="Enter Temparature"
              />
              <Button onClick={() => triggerTempVoilation()}>
                Trigger Temperature Voilation
              </Button>
            </div>
            {message.temp ? (
              <p style={{ paddingLeft: "20px" }}>{message.temp}</p>
            ) : (
              ""
            )}
            <div>
              <div style={{ display: "flex", margin: "20px" }}>
                <input
                  value={hum}
                  onChange={humChange}
                  placeholder="Enter Humidity"
                />
                <Button onClick={() => triggerHumVoilation()}>
                  Trigger Humidity Voilation
                </Button>
              </div>
              {message.hum ? (
                <p style={{ paddingLeft: "20px" }}>{message.hum}</p>
              ) : (
                ""
              )}
            </div>
            <div style={{ display: "flex", margin: "20px" }}>
              <input
                value={lightExpo}
                onChange={lightExpoChange}
                placeholder="Enter Light Exposure"
              />
              <Button onClick={() => triggerLightExpoVoilation()}>
                Trigger Light Exposure Voilation
              </Button>
            </div>
            {message.lightExpo ? (
              <p style={{ paddingLeft: "20px" }}>{message.lightExpo}</p>
            ) : (
              ""
            )}
          </div>
        </div>
        {voilationDetails
          ? voilationInfo(voilationDetails)
          : transaction
          ? "Waiting For Blockchain Transaction To be Completed"
          : ""}
      </Body>
    </div>
  );
}

export default App;

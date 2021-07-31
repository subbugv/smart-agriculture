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
  const [message, setMessage] = useState("");
  const [temp, setTemp] = useState("");
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
      .addSeed("Tomatoes", "1", 100, 25, 34, 70, 20)
      .then((res) => console.log(res));
  };

  const triggerTempVoilation = async () => {
    if (temp) {
      const contract = contractInstance(signer);
      await contract.temperatureSelfCheck(temp).then((res) => console.log(res));
      contract.once(
        "TemperatureViolation",
        (address, msg, actualTemp, otpimumTemp) => {
          setVoilationDetails({
            temp: {
              address,
              msg,
              actual: actualTemp,
              optimum: otpimumTemp,
            },
          });
        }
      );
      setTemp("");
    } else {
      setMessage("Please enter temperature");
    }
  };

  const triggerHumVoilation = async () => {
    const contract = contractInstance(signer);
    await contract.temperatureSelfCheck(70).then((res) => console.log(res));
    contract.once(
      "HummidityViolation",
      (address, msg, actualHum, otpimumHum) => {
        console.log(address, msg, actualHum.toNumber(), otpimumHum.toNumber());
      }
    );
  };

  const triggerLightExpoVoilation = async () => {
    const contract = contractInstance(signer);
    await contract.lightExpoSelfCheck(15).then((res) => console.log(res));
    contract.once(
      "LightExposureViolation",
      (address, msg, actualLightExpo, otpimumLightExpo) => {
        console.log(
          address,
          msg,
          actualLightExpo.toNumber(),
          otpimumLightExpo.toNumber()
        );
      }
    );
  };

  useEffect(() => {
    if (provider) {
      const signer = provider.getSigner();
      setSigner(signer);
    }
  }, [provider]);

  const tempChange = (e) => {
    setMessage("");
    if (voilationDetails?.temp)
      setVoilationDetails();
    setTemp(e.target.value);
  };

  const voilationInfo = (info) => {
      return (
        <div>
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
        <Button onClick={() => addSeed()}>Add Seed</Button>
        <input
          value={temp}
          onChange={tempChange}
          placeholder="Enter Temparature"
        />
        {message ? <p>{message}</p> : ""}
        <Button onClick={() => triggerTempVoilation()}>
          Trigger Temperature Voilation
        </Button>
        {voilationDetails?.temp ? voilationInfo(voilationDetails?.temp) : ""}
        <Button onClick={() => triggerHumVoilation()}>
          Trigger Humidity Voilation
        </Button>
        <Button onClick={() => triggerLightExpoVoilation()}>
          Trigger Light Exposure Voilation
        </Button>
      </Body>
    </div>
  );
}

export default App;

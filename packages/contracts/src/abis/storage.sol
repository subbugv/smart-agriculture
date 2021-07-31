// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4 <0.9.0;

contract Storage{
    
    address owner_address;
    address storage_address = 0x46a1bE93A7940252692c47d8201dF307BE023891;
    
    
    // attributes
    string seedName;
    string batch_id;
    uint quantity;
    uint unitPrice;
    uint optimumTemp;
    uint optimumHum;
    uint optimumLightExpo;
    uint storageDate;
    
    
    // enum for event handling
    enum TempCondition {Optimum, Over, Under}
    TempCondition public tempCOn;
    
    enum HumCondition {Optimum, Over, Under}
    HumCondition public humCOn;
    
    enum LightExpoCondition {Optimum, Over, Under}
    LightExpoCondition public lightCOn;
    
    enum ViolationType{None, Temperature, Hummidity, LightExposure}
    ViolationType public violationType;
    
    constructor() {
        owner_address = msg.sender;
        storageDate = block.timestamp;
        tempCOn = TempCondition.Optimum;
        humCOn = HumCondition.Optimum;
        lightCOn = LightExpoCondition.Optimum;
        violationType = ViolationType.None;
    }
    
    
    // modifiers for access control
    modifier OnlyOwner(){
        require(msg.sender == owner_address);
        _;
    }
    
    modifier OnlyStorage(){
        require(msg.sender == storage_address);
        _;
    }
    
    event seedStored(address ad, string  msg);
    event TemperatureViolation(address ad, string msg, uint actualTemp, uint optimumTemp);
    event HummidityViolation(address ad, string msg, uint actualHum, uint optimumHum);
    event LightExposureViolation(address ad, string msg, uint actualLightExpo, uint optimumLightExpo);
    
    
    // adding seed to the storage
    function addSeed(
        string memory name,
        string memory bat_id,
        uint quant,
        uint price,
        uint optTem,
        uint optHum,
        uint optLitEx) public OnlyOwner{
            
        seedName = name;
        batch_id = bat_id;
        quantity = quant;
        unitPrice = price;
        optimumTemp = optTem;
        optimumHum = optHum;
        optimumLightExpo = optLitEx;
        
    }
    
    // contract performing self check for temperature
    function temperatureSelfCheck(uint value) public OnlyStorage returns(string memory){
        if(value > optimumTemp){
            violationTrigger(ViolationType.Temperature, 1, value);
            return "Current temperature is over the threshold";
        }else if(value < optimumTemp){
            violationTrigger(ViolationType.Temperature, 0, value);
            return "Current temperature is below the threshold";
        }else{
            violationTrigger(ViolationType.Temperature, 2, value);
            return "Current temperature is optimum";
        }
    }
    
    
    // contract performing self check for hummidity
    function hummiditySelfCheck(uint value) public OnlyStorage returns(string memory){
        if(value > optimumHum){
            violationTrigger(ViolationType.Hummidity, 1, value);
            return "Current hummidity is over the threshold";
        }else if(value < optimumHum){
            violationTrigger(ViolationType.Hummidity, 0, value);
            return "Current hummidity is below the threshold";
        }else{
            violationTrigger(ViolationType.Hummidity, 2, value);
            return "Current hummidity is optimum";
        }
    }
    
    
    // contract performing self check for lightExposure
    function lightExpoSelfCheck(uint value) public OnlyStorage returns(string memory){
        if(value > optimumLightExpo){
            violationTrigger(ViolationType.LightExposure, 1, value);
            return "Current light exposure is over the threshold";
        }else if(value < optimumLightExpo){
            violationTrigger(ViolationType.LightExposure, 0, value);
            return "Current light exposure is below the threshold";
        }else{
            violationTrigger(ViolationType.None, 2, value);
            return "Current light exposure is optimum";
        }
    }
    
    
    // trigerring violation
    function violationTrigger(ViolationType vio, int category, uint value) 
        public OnlyStorage{ //category 0 = under, 1 = over, 2 optimum 
        
        if(vio == ViolationType.Temperature){
            if(category == 1){
                tempCOn = TempCondition.Over;
                violationType = ViolationType.Temperature;
                emit TemperatureViolation(storage_address, "Temparature is over the threshold", value, optimumTemp);  
            }else if(category == 0){
                tempCOn = TempCondition.Under;
                violationType = ViolationType.Temperature;
                emit TemperatureViolation(storage_address, "Temparature is below the threshold", value, optimumTemp);
            }else if(category == 2){
                tempCOn = TempCondition.Optimum;
                violationType = ViolationType.None;
                emit TemperatureViolation(storage_address, "Temparature is Optimum", value, optimumTemp);
                
            }
        }else if(vio == ViolationType.Hummidity){
            if(category == 1){
                humCOn = HumCondition.Over;
                violationType = ViolationType.Hummidity;
                emit HummidityViolation(storage_address, "Hummidity is over the threshold", value, optimumHum); 
            }else if(category == 0){
                humCOn = HumCondition.Under;
                violationType = ViolationType.Hummidity;
                emit HummidityViolation(storage_address, "Hummidity is below the threshold", value, optimumHum);
            }else if(category == 2){
                humCOn = HumCondition.Optimum;
                violationType = ViolationType.None;
                emit HummidityViolation(storage_address, "Hummidity is Optimum", value, optimumHum);
            }
            
        }else if(vio == ViolationType.LightExposure){
            if(category == 1){
                lightCOn = LightExpoCondition.Over;
                violationType = ViolationType.LightExposure;
                emit LightExposureViolation(storage_address, "Light exposure is over the threshold", value, optimumLightExpo);
            }else if(category == 0){
                lightCOn = LightExpoCondition.Under;
                violationType = ViolationType.LightExposure;
                emit LightExposureViolation(storage_address, "Light exposure is below the threshold", value, optimumLightExpo);
            }else if(category == 2){
                lightCOn = LightExpoCondition.Optimum;
                violationType = ViolationType.None;
                emit LightExposureViolation(storage_address, "Light exposure is optimum", value, optimumLightExpo);
            }
        }
    }
    
    
}

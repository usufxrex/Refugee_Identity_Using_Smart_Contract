// Initialize Web3
if (typeof web3 !== "undefined") {
    web3 = new Web3(web3.currentProvider);
    startApp();
} else {
    console.log("Web3 not found. Please install Metamask.");
}

async function startApp() {
    // Contracts addresses and ABIs

    const contract1Abi = [
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_citizenHash",
                    "type": "bytes32"
                }
            ],
            "name": "addCitizensHash",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "citizensHashes",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getCitizensHashes",
            "outputs": [
                {
                    "internalType": "bytes32[]",
                    "name": "",
                    "type": "bytes32[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]; // Replace with the ABI of Contract1
    const contract2Abi = [
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_serialNo",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes32",
                    "name": "_familyCardHash",
                    "type": "bytes32"
                }
            ],
            "name": "addFoodItem",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_serialNo",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes32",
                    "name": "_familyCardHash",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes32",
                    "name": "_refugeeIdentityHash",
                    "type": "bytes32"
                }
            ],
            "name": "addNonFoodItem",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_familyUniqueID",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes32",
                    "name": "_refugeeIdentityHash",
                    "type": "bytes32"
                }
            ],
            "name": "createFamilyCard",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_id",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes32",
                    "name": "_maleRefugeeHash",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes32",
                    "name": "_femaleRefugeeHash",
                    "type": "bytes32"
                }
            ],
            "name": "createNewFamily",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_citizensHashStorageAddress",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "isVerified",
                    "type": "bool"
                }
            ],
            "name": "RefugeeVerified",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "familyUniqueID",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "refugeeIdentityHash",
                    "type": "bytes32"
                }
            ],
            "name": "familyCardCreated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "serialNo",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "familyCardHash",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "foodItemHash",
                    "type": "bytes32"
                }
            ],
            "name": "foodItemAdded",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "maleRefugeeHash",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "femaleRefugeeHash",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "familyHash",
                    "type": "bytes32"
                }
            ],
            "name": "newFamilyCreated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "serialNo",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "familyCardHash",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "refugeeIdentityHash",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "nonFoodItemHash",
                    "type": "bytes32"
                }
            ],
            "name": "nonFoodItemAdded",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "uniqueID",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "refugeeHash",
                    "type": "bytes32"
                }
            ],
            "name": "refugeeRegistered",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_uniqueID",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_sex",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_age",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_bloodGroup",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_religion",
                    "type": "string"
                }
            ],
            "name": "registerRefugee",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "refugeeIris",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "refugeeFinger",
                    "type": "string"
                }
            ],
            "name": "checkRefugeeData",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "citizensHashStorageAddress",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getAllRefugees",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "",
                    "type": "uint256[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_familyHash",
                    "type": "bytes32"
                }
            ],
            "name": "getFamilyByHash",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes32",
                    "name": "maleRefugeeHash",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes32",
                    "name": "femaleRefugeeHash",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_refugeeIdentityHash",
                    "type": "bytes32"
                }
            ],
            "name": "getFamilyCardByHash",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "familyCardHash",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_foodItemHash",
                    "type": "bytes32"
                }
            ],
            "name": "getFoodItemByHash",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "familyCardHash",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes32",
                    "name": "foodItemHash",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_id",
                    "type": "uint256"
                }
            ],
            "name": "getNewFamilyById",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "maleRefugeeHash",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes32",
                    "name": "femaleRefugeeHash",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes32",
                    "name": "familyHash",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_nonFoodItemHash",
                    "type": "bytes32"
                }
            ],
            "name": "getNonFoodItemByHash",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "familyCardHash",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes32",
                    "name": "refugeeIdentityHash",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes32",
                    "name": "nonFoodItemHash",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_uniqueID",
                    "type": "uint256"
                }
            ],
            "name": "getRefugee",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "name",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes32",
                    "name": "sex",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes32",
                    "name": "age",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes32",
                    "name": "bloodGroup",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes32",
                    "name": "religion",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes32",
                    "name": "refugeeHash",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_refugeeIdentityHash",
                    "type": "bytes32"
                }
            ],
            "name": "getRefugeeByHash",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "name",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes32",
                    "name": "sex",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes32",
                    "name": "age",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes32",
                    "name": "bloodGroup",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes32",
                    "name": "religion",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]; // Replace with the ABI of Contract2

    const contract1Address = '0xE12f219d9F1Fd4a733513EBF2a058b7D3dFc7aC0'; // Replace with the address of Contract1
    const contract2Address = '0xE4051b904e0Fb227B8750289459a493566A2BfF3'; // Replace with the address of Contract2

    // Initialize contracts
    const contract1 = new web3.eth.Contract(contract1Abi, contract1Address);
    const contract2 = new web3.eth.Contract(contract2Abi, contract2Address);

    // Get accounts
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    document.getElementById("account").textContent = account;

    // Handle adding citizen hash
    const addHashButton = document.getElementById("addHashButton");
    const citizenHashInput = document.getElementById("citizenHash");
    const hashesList = document.getElementById("hashes");

    addHashButton.addEventListener("click", async () => {
        const citizenHash = citizenHashInput.value;
        if (citizenHash) {
            await contract1.methods.addCitizensHash(citizenHash).send({ from: account });

            const newHashItem = document.createElement("li");
            newHashItem.textContent = citizenHash;
            hashesList.appendChild(newHashItem);

            citizenHashInput.value = "";
        }
    });

    // Load existing citizen hashes
    const citizenHashes = await contract1.methods.getCitizensHashes().call();
    citizenHashes.forEach(hash => {
        const hashItem = document.createElement("li");
        hashItem.textContent = hash;
        hashesList.appendChild(hashItem);
    });

    // handle on click verifyrefugge
    const verifyRefugeeButton = document.getElementById("verifyRefugeeButton");
    verifyRefugeeButton.addEventListener("click", verifyRefugee);

    async function verifyRefugee() {
        const refugeeIris = document.getElementById('refugeeIris').value;
        const refugeeFinger = document.getElementById('refugeeFinger').value;

        try {
            const accounts = await web3.eth.getAccounts();
            const contractOwner = accounts[0]; // Assume the first account is the contract owner

            // Call the checkRefugeeData function on the contract
            const result = await contract2.methods.checkRefugeeData(refugeeIris, refugeeFinger).call({ from: contractOwner });

            if (result) {
                document.getElementById('verificationResult').innerText = 'Verified: This person is a Citizen.';
            } else {
                document.getElementById('verificationResult').innerText = 'Not Verified: This person is a refugee. Proceed to Register Refugee.';
            }
        } catch (error) {
            console.error('Error verifying refugee:', error);
        }
    }

    function bytes32ToString(bytes32) {
        return web3.utils.hexToUtf8(bytes32);
    }

    // handle on click registerRefugee
    const registerButton = document.getElementById("registerButton");
    registerButton.addEventListener("click", registerRefugee);

    async function registerRefugee() {
        const uniqueID = parseInt(document.getElementById("uniqueID").value);
        const name = document.getElementById("name").value.toUpperCase();
        const sex = document.getElementById("sex").value.toUpperCase();
        const age = document.getElementById("age").value.toUpperCase();
        const bloodGroup = document.getElementById("bloodGroup").value.toUpperCase();
        const religion = document.getElementById("religion").value.toUpperCase();

        try {
            const accounts = await web3.eth.getAccounts();
            const contractOwner = accounts[0]; // Assuming the first account is the contract owner

            // Call the registerRefugee function on the contract
            const result = await contract2.methods.registerRefugee(uniqueID, name, sex, age, bloodGroup, religion)
                .send({ from: contractOwner });

            console.log("Refugee registered successfully", result);
        } catch (error) {
            console.error("Error registering refugee:", error);
        }
    }

    const getInfoButton = document.getElementById("getInfoButton");
    getInfoButton.addEventListener("click", getRefugeeInfo);

    async function getRefugeeInfo() {
        const uniqueID = parseInt(document.getElementById("getUniqueID").value);

        try {
            const result = await contract2.methods.getRefugee(uniqueID).call();
        
            const name = bytes32ToString(result[0]);
            const sex = bytes32ToString(result[1]);
            const age = bytes32ToString(result[2]);
            const bloodGroup = bytes32ToString(result[3]);
            const religion = bytes32ToString(result[4]);

            const refugeeHash = generateRefugeeHash(name, sex, age, bloodGroup, religion);

            const resultDiv = document.getElementById("result");
            resultDiv.innerHTML = `
                <h2>Refugee Information</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Sex:</strong> ${sex}</p>
                <p><strong>Age:</strong> ${age}</p>
                <p><strong>Blood Group:</strong> ${bloodGroup}</p>
                <p><strong>Religion:</strong> ${religion}</p>
                <p><strong>Refugee Hash:</strong> ${refugeeHash}</p>
            `;
        } catch (error) {
            console.error("Error fetching refugee information:", error);
        }
    }

    const getInfoButtonByHash = document.getElementById("getInfoButtonByHash");
    getInfoButtonByHash.addEventListener("click", getRefugeeInfoByHash);

    async function getRefugeeInfoByHash() {
        const refugeeHash = document.getElementById("refugeeHash").value;
        
        try {
            const result = await contract2.methods.getRefugeeByHash(refugeeHash).call();
        
            const name = web3.utils.hexToUtf8(result[0]);
            const sex = web3.utils.hexToUtf8(result[1]);
            const age = web3.utils.hexToUtf8(result[2]);
            const bloodGroup = web3.utils.hexToUtf8(result[3]);
            const religion = web3.utils.hexToUtf8(result[4]);
        
            const resultDiv = document.getElementById("resultByHash");
            resultDiv.innerHTML = `
                <h2>Refugee Information</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Sex:</strong> ${sex}</p>
                <p><strong>Age:</strong> ${age}</p>
                <p><strong>Blood Group:</strong> ${bloodGroup}</p>
                <p><strong>Religion:</strong> ${religion}</p>
            `;
        } catch (error) {
            console.error("Error fetching refugee information:", error);
        }
    }

    // Listen for the click event on the button
    const createFamilyCardButton = document.getElementById("createFamilyCardButton");
    createFamilyCardButton.addEventListener("click", createFamilyCard);

    // Function to create a family card
    async function createFamilyCard() {
        const familyUniqueID = parseInt(document.getElementById("familyUniqueID").value);
        const refugeeIdentityHash = document.getElementById("refugeeIdentityHash").value;
    
        try {
            // Get the current Ethereum accounts
            const accounts = await web3.eth.getAccounts();
            const contractOwner = accounts[0];
    
            // Call the createFamilyCard function on the contract
            await contract2.methods.createFamilyCard(familyUniqueID, refugeeIdentityHash).send({ from: contractOwner });
    
            console.log("Family card created successfully");
        } catch (error) {
            console.error("Error creating family card:", error);
        }
    }

    async function getFamilyCardByHash() {
        const refugeeIdentityHash = document.getElementById("refugeeIdentityHash").value;
    
        try {
            // Call the getFamilyCardByHash function on the contract
            const familyCardHash = await contract2.methods.getFamilyCardByHash(refugeeIdentityHash).call();
    
            const resultDiv = document.getElementById("result1");
            resultDiv.innerHTML = `
                <h2>Family Card Information</h2>
                <p><strong>Refugee Identity Hash:</strong> ${refugeeIdentityHash}</p>
                <p><strong>Family Card Hash from Contract:</strong> ${familyCardHash}</p>
            `;
    
            console.log("Family card hash retrieved successfully:", familyCardHash);
        } catch (error) {
            console.error("Error getting family card hash:", error);
        }
    }
    
    // Listen for the click event on the button
    const getFamilyCardButton = document.getElementById("getFamilyCardButton");
    getFamilyCardButton.addEventListener("click", getFamilyCardByHash);

    // Create New Family
    const createNewFamilyButton = document.getElementById("createNewFamilyButton");
    createNewFamilyButton.addEventListener("click", createNewFamily);

    async function createNewFamily() {
        const newFamilyId = parseInt(document.getElementById("newFamilyId").value);
        const maleRefugeeHash = document.getElementById("maleRefugeeHash").value;
        const femaleRefugeeHash = document.getElementById("femaleRefugeeHash").value;

        try {
            // Get the current Ethereum accounts
            const accounts = await web3.eth.getAccounts();
            const contractOwner = accounts[0];
            // Call the createNewFamily function on the contract
            const result = await contract2.methods.createNewFamily(newFamilyId, maleRefugeeHash, femaleRefugeeHash).send({ from: contractOwner });

            console.log('Family Created:', result);

            // Display success message
            const createNewFamilyResult = document.getElementById("createNewFamilyResult");
            createNewFamilyResult.innerHTML = "New family created successfully.";
        } catch (error) {
            console.error("Error creating new family:", error);
        }
    }

    // Get Family By ID
    const getFamilyByIdButton = document.getElementById("getFamilyByIdButton");
    getFamilyByIdButton.addEventListener("click", getFamilyById);

    async function getFamilyById() {
        const familyId = parseInt(document.getElementById("getFamilyId").value);
    
        try {
            // Call the getNewFamilyById function on the contract
            const result = await contract2.methods.getNewFamilyById(familyId).call();
    
            const maleRefugeeHash = result[0];
            const femaleRefugeeHash = result[1];
            const familyHash = result[2];
    
            const resultDiv = document.getElementById("getFamilyByIdResult");
            resultDiv.innerHTML = `
                <h2>Family Information</h2>
                <p><strong>Male Refugee Hash:</strong> ${maleRefugeeHash}</p>
                <p><strong>Female Refugee Hash:</strong> ${femaleRefugeeHash}</p>
                <p><strong>Family Hash:</strong> ${familyHash}</p>
            `;
        } catch (error) {
            console.error("Error getting family by ID:", error);
        }
    }

    // Listen for the click event on the "Add Food Item" button
    const addFoodItemButton = document.getElementById("addFoodItemButton");
    addFoodItemButton.addEventListener("click", addFoodItem);

    async function addFoodItem() {
        const serialNo = parseInt(document.getElementById("foodSerialNo").value);
        const familyCardHash = document.getElementById("foodFamilyCardHash").value;

        try {
            // Call the addFoodItem function on the contract
            await contract2.methods.addFoodItem(serialNo, familyCardHash).send({ from: account });

            // Display success message
            const addFoodItemResult = document.getElementById("addFoodItemResult");
            addFoodItemResult.innerHTML = "Food item added successfully.";
        } catch (error) {
            console.error("Error adding food item:", error);
        }
    }
    
    // Listen for the click event on the "Add Non-Food Item" button
    const addNonFoodItemButton = document.getElementById("addNonFoodItemButton");
    addNonFoodItemButton.addEventListener("click", addNonFoodItem);

    async function addNonFoodItem() {
        const serialNo = parseInt(document.getElementById("nonFoodSerialNo").value);
        const familyCardHash = document.getElementById("nonFoodFamilyCardHash").value;
        const refugeeIdentityHash = document.getElementById("nonFoodRefugeeIdentityHash").value;

        try {
            // Call the addNonFoodItem function on the contract
            await contract2.methods.addNonFoodItem(serialNo, familyCardHash, refugeeIdentityHash).send({ from: account });

            // Display success message
            const addNonFoodItemResult = document.getElementById("addNonFoodItemResult");
            addNonFoodItemResult.innerHTML = "Non-food item added successfully.";
        } catch (error) {
            console.error("Error adding non-food item:", error);
        }
    }
    
    function generateRefugeeHash(
        name,
        sex,
        age,
        bloodGroup,
        religion
    ) {
        // Convert uniqueID to a string and then concatenate all values
        const dataToHash = name +
            sex +
            age +
            bloodGroup +
            religion;
    
        // Hash the hexadecimal data
        const userHash = web3.utils.keccak256(dataToHash);
        return userHash;
    }

}

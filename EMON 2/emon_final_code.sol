// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
// Import the CitizensHashStorage contract
import "./CitizensHashStorage.sol";

contract RefugeeManagement {

    struct RefugeeIdentity {
        uint uniqueID;
        bytes32 name;
        bytes32 sex;
        bytes32 age;
        bytes32 bloodGroup;
        bytes32 religion;
    }

    struct FamilyCard {
        uint familyUniqueID;
        bytes32 refugeeIdentityHash;
        bytes32 familyCardHash; // Add a hash for FamilyCard
    }

    struct NewFamilyCreation {
        uint id;
        bytes32 maleRefugeeHash;
        bytes32 femaleRefugeeHash;
        bytes32 familyHash; // Hash for the entire family
    }

    struct NonFoodItem {
        uint serialNo;
        bytes32 familyCardHash;
        bytes32 refugeeIdentityHash;
    }

    struct FoodItem {
        uint serialNo;
        bytes32 familyCardHash;
        bytes32 foodItemHash; // Add a hash for FoodItem
    }

    mapping(uint => RefugeeIdentity) refugees;
    mapping(uint => FamilyCard) familyCards;
    mapping(uint => NewFamilyCreation) newFamilies; // Map new family creations to an ID
    mapping(uint => NonFoodItem) nonFoodItems; // Map NonFoodItem to a unique ID
    mapping(uint => FoodItem) foodItems; // Map FoodItem to a unique ID

    uint[] refugeeIDs;
    uint[] familyIDs;
    uint[] newFamilyIDs;
    uint[] nonFoodItemSerialNumbers;
    uint[] foodItemSerialNumbers;

    address contractOwner;

    event refugeeRegistered(uint uniqueID, bytes32 refugeeHash);
    event familyCardCreated(uint familyUniqueID, bytes32 refugeeIdentityHash);
    event newFamilyCreated(uint id, bytes32 maleRefugeeHash, bytes32 femaleRefugeeHash, bytes32 familyHash);
    event nonFoodItemAdded(uint serialNo, bytes32 familyCardHash, bytes32 refugeeIdentityHash, bytes32 nonFoodItemHash);
    event foodItemAdded(uint serialNo, bytes32 familyCardHash, bytes32 foodItemHash);

    constructor(address _citizensHashStorageAddress) {
        contractOwner = msg.sender;
        citizensHashStorageAddress = _citizensHashStorageAddress;
    }
    

    modifier onlyOwner() {
        require(msg.sender == contractOwner, "You are not authorized");
        _;
    }

    // Address of the CitizensHashStorage contract
    address public citizensHashStorageAddress;

    // Event to emit when a refugee's hash is verified
    event RefugeeVerified(bool isVerified);

    // Function to check if a refugee's hash matches any of the citizens' hashes
    function checkRefugeeData(string memory refugeeIris, string memory refugeeFinger) public view returns (bool) {
        // Concatenate refugeeIris and refugeeFinger
        string memory concatenatedData = string(abi.encodePacked(refugeeIris, refugeeFinger));
        
        // Calculate the keccak256 hash of the concatenated data
        bytes32 calculatedHash = keccak256(bytes(concatenatedData));

        // Access citizensHashes from the CitizensHashStorage contract
        CitizensHashStorage citizensHashStorage = CitizensHashStorage(citizensHashStorageAddress);
        bytes32[] memory citizenHashes = citizensHashStorage.getCitizensHashes();

        // Check if the calculated hash exists in citizenHashes array
        for (uint256 i = 0; i < citizenHashes.length; i++) {
            if (calculatedHash == citizenHashes[i]) {
                return true;
            }
        }

        return false;
    }

    function registerRefugee(uint _uniqueID, string memory _name, string memory _sex, string memory _age, string memory _bloodGroup, string memory _religion) public onlyOwner {
        require(refugees[_uniqueID].uniqueID != _uniqueID, "Refugee already registered");

        _name = toUpper(_name);
        _sex = toUpper(_sex);
        _bloodGroup = toUpper(_bloodGroup);
        _religion = toUpper(_religion);

        refugees[_uniqueID].uniqueID = _uniqueID;
        refugees[_uniqueID].name = stringToBytes32(_name);
        refugees[_uniqueID].sex = stringToBytes32(_sex);
        refugees[_uniqueID].age = stringToBytes32(_age);
        refugees[_uniqueID].bloodGroup = stringToBytes32(_bloodGroup);
        refugees[_uniqueID].religion = stringToBytes32(_religion);

        refugeeIDs.push(_uniqueID);

        bytes32 refugeeHash = generateHash(_name, _sex, _age, _bloodGroup, _religion);
        emit refugeeRegistered(_uniqueID, refugeeHash);
    }

    function createFamilyCard(uint _familyUniqueID, bytes32 _refugeeIdentityHash) public onlyOwner {
        require(familyCards[_familyUniqueID].familyUniqueID != _familyUniqueID, "Family card already created for this family");

        familyCards[_familyUniqueID].familyUniqueID = _familyUniqueID;
        familyCards[_familyUniqueID].refugeeIdentityHash = _refugeeIdentityHash;

        // Generate the FamilyCard hash and store it
        familyCards[_familyUniqueID].familyCardHash = generateFamilyCardHash(_familyUniqueID, _refugeeIdentityHash);

        familyIDs.push(_familyUniqueID);

        emit familyCardCreated(_familyUniqueID, _refugeeIdentityHash);
    }

    function createNewFamily(uint _id, bytes32 _maleRefugeeHash, bytes32 _femaleRefugeeHash) public onlyOwner {
        require(newFamilies[_id].id != _id, "Family already created with this ID");

        newFamilies[_id].id = _id;
        newFamilies[_id].maleRefugeeHash = _maleRefugeeHash;
        newFamilies[_id].femaleRefugeeHash = _femaleRefugeeHash;

        // Generate the Family hash and store it
        newFamilies[_id].familyHash = generateFamilyHash(_maleRefugeeHash, _femaleRefugeeHash);

        newFamilyIDs.push(_id);

        emit newFamilyCreated(_id, _maleRefugeeHash, _femaleRefugeeHash, newFamilies[_id].familyHash);
    }

    function getNewFamilyById(uint _id) public view returns (bytes32 maleRefugeeHash, bytes32 femaleRefugeeHash, bytes32 familyHash) {
        require(newFamilies[_id].id == _id, "Family not found with this ID");
        
        maleRefugeeHash = newFamilies[_id].maleRefugeeHash;
        femaleRefugeeHash = newFamilies[_id].femaleRefugeeHash;
        familyHash = newFamilies[_id].familyHash;

        return (maleRefugeeHash, femaleRefugeeHash, familyHash);
    }

    function getRefugee(uint _uniqueID) public view returns (bytes32 name, bytes32 sex, bytes32 age, bytes32 bloodGroup, bytes32 religion, bytes32 refugeeHash) {
        require(refugees[_uniqueID].uniqueID == _uniqueID, "Refugee not found");

        name = refugees[_uniqueID].name;
        sex = refugees[_uniqueID].sex;
        age = refugees[_uniqueID].age;
        bloodGroup = refugees[_uniqueID].bloodGroup;
        religion = refugees[_uniqueID].religion;

        refugeeHash = generateHash(bytes32ToString(name), bytes32ToString(sex), bytes32ToString(age), bytes32ToString(bloodGroup), bytes32ToString(religion));

        return (name, sex, age, bloodGroup, religion, refugeeHash);
    }



    function getRefugeeByHash(bytes32 _refugeeIdentityHash) public view returns (bytes32 name, bytes32 sex, bytes32 age, bytes32 bloodGroup, bytes32 religion) {
        uint uniqueID = findRefugeeIDByHash(_refugeeIdentityHash);
        (name, sex, age, bloodGroup, religion, ) = getRefugee(uniqueID);
        return (name, sex, age, bloodGroup, religion);
    }


    function getAllRefugees() public view returns (uint[] memory) {
        return refugeeIDs;
    }

    function getFamilyCardByHash(bytes32 _refugeeIdentityHash) public view returns (bytes32 familyCardHash) {
        uint familyUniqueID = findFamilyCardIDByHash(_refugeeIdentityHash);
        return familyCards[familyUniqueID].familyCardHash;
    }

    function getFamilyByHash(bytes32 _familyHash) public view returns (uint id, bytes32 maleRefugeeHash, bytes32 femaleRefugeeHash) {
        for (uint i = 0; i < newFamilyIDs.length; i++) {
            if (newFamilies[newFamilyIDs[i]].familyHash == _familyHash) {
                id = newFamilies[newFamilyIDs[i]].id;
                maleRefugeeHash = newFamilies[newFamilyIDs[i]].maleRefugeeHash;
                femaleRefugeeHash = newFamilies[newFamilyIDs[i]].femaleRefugeeHash;
                return (id, maleRefugeeHash, femaleRefugeeHash);
            }
        }
        revert("Family not found for the given hash");
    }

    function addNonFoodItem(uint _serialNo, bytes32 _familyCardHash, bytes32 _refugeeIdentityHash) public onlyOwner {
        require(nonFoodItems[_serialNo].serialNo != _serialNo, "Non-food item already added with this serial number");

        nonFoodItems[_serialNo].serialNo = _serialNo;
        nonFoodItems[_serialNo].familyCardHash = _familyCardHash;
        nonFoodItems[_serialNo].refugeeIdentityHash = _refugeeIdentityHash;

        nonFoodItemSerialNumbers.push(_serialNo);

        // Generate the NonFoodItem hash and store it
        bytes32 nonFoodItemHash = generateNonFoodItemHash(_serialNo, _familyCardHash, _refugeeIdentityHash);

        emit nonFoodItemAdded(_serialNo, _familyCardHash, _refugeeIdentityHash, nonFoodItemHash);
    }

    function addFoodItem(uint _serialNo, bytes32 _familyCardHash) public onlyOwner {
        require(foodItems[_serialNo].serialNo != _serialNo, "Food item already added with this serial number");

        foodItems[_serialNo].serialNo = _serialNo;
        foodItems[_serialNo].familyCardHash = _familyCardHash;

        foodItemSerialNumbers.push(_serialNo);

        // Generate the FoodItem hash and store it
        bytes32 foodItemHash = generateFoodItemHash(_serialNo, _familyCardHash);

        emit foodItemAdded(_serialNo, _familyCardHash, foodItemHash);
    }

    function getNonFoodItemByHash(bytes32 _nonFoodItemHash) public view returns (bytes32 familyCardHash, bytes32 refugeeIdentityHash, bytes32 nonFoodItemHash) {
        for (uint i = 0; i < nonFoodItemSerialNumbers.length; i++) {
            uint _serialNo = nonFoodItemSerialNumbers[i];
            bytes32 hash = generateNonFoodItemHash(_serialNo, nonFoodItems[_serialNo].familyCardHash, nonFoodItems[_serialNo].refugeeIdentityHash);
            if (hash == _nonFoodItemHash) {
                return (nonFoodItems[_serialNo].familyCardHash, nonFoodItems[_serialNo].refugeeIdentityHash, hash);
            }
        }
        revert("Non-food item not found for the given hash");
    }

    function getFoodItemByHash(bytes32 _foodItemHash) public view returns (bytes32 familyCardHash, bytes32 foodItemHash) {
        for (uint i = 0; i < foodItemSerialNumbers.length; i++) {
            uint _serialNo = foodItemSerialNumbers[i];
            bytes32 hash = generateFoodItemHash(_serialNo, foodItems[_serialNo].familyCardHash);
            if (hash == _foodItemHash) {
                return (foodItems[_serialNo].familyCardHash, hash);
            }
        }
        revert("Food item not found for the given hash");
    }

    function generateNonFoodItemHash(uint _serialNo, bytes32 _familyCardHash, bytes32 _refugeeIdentityHash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_serialNo, _familyCardHash, _refugeeIdentityHash));
    }

    function generateFoodItemHash(uint _serialNo, bytes32 _familyCardHash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_serialNo, _familyCardHash));
    }

    function stringToBytes32(string memory source) internal pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }

    function toUpper(string memory str) internal pure returns (string memory) {
        bytes memory bStr = bytes(str);
        bytes memory bUpper = new bytes(bStr.length);
        for (uint i = 0; i < bStr.length; i++) {
            if ((uint8(bStr[i]) >= 97) && (uint8(bStr[i]) <= 122)) {
                bUpper[i] = bytes1(uint8(bStr[i]) - 32);
            } else {
                bUpper[i] = bStr[i];
            }
        }
        return string(bUpper);
    }

    function findRefugeeIDByHash(bytes32 _refugeeIdentityHash) internal view returns (uint) {
        for (uint i = 0; i < refugeeIDs.length; i++) {
            if (generateHash(bytes32ToString(refugees[refugeeIDs[i]].name),
                            bytes32ToString(refugees[refugeeIDs[i]].sex),
                            bytes32ToString(refugees[refugeeIDs[i]].age),
                            bytes32ToString(refugees[refugeeIDs[i]].bloodGroup),
                            bytes32ToString(refugees[refugeeIDs[i]].religion)) == _refugeeIdentityHash) {
                return refugees[refugeeIDs[i]].uniqueID;
            }
        }
        revert("Refugee not found for the given hash");
    }

    function findFamilyCardIDByHash(bytes32 _refugeeIdentityHash) internal view returns (uint) {
        for (uint i = 0; i < familyIDs.length; i++) {
            if (familyCards[familyIDs[i]].refugeeIdentityHash == _refugeeIdentityHash) {
                return familyCards[familyIDs[i]].familyUniqueID;
            }
        }
        revert("Family card not found for the given hash");
    }

    function bytes32ToString(bytes32 _bytes32) internal pure returns (string memory) {
        uint8 i = 0;
        while (i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (uint8 j = 0; j < i; j++) {
            bytesArray[j] = _bytes32[j];
        }
        return string(bytesArray);
    }

    function generateHash(string memory _name, string memory _sex, string memory _age, string memory _bloodGroup, string memory _religion) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_name, _sex, _age, _bloodGroup, _religion));
    }

    function generateFamilyCardHash(uint _familyUniqueID, bytes32 _refugeeIdentityHash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_familyUniqueID, _refugeeIdentityHash));
    }

    function generateFamilyHash(bytes32 _maleRefugeeHash, bytes32 _femaleRefugeeHash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_maleRefugeeHash, _femaleRefugeeHash));
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CitizensHashStorage {
    bytes32[] public citizensHashes;

    // Function to set a citizen's hash
    function addCitizensHash(bytes32 _citizenHash) public {
        citizensHashes.push(_citizenHash);
    }

    // Function to get the entire list of citizen hashes
    function getCitizensHashes() public view returns (bytes32[] memory) {
        return citizensHashes;
    }
}

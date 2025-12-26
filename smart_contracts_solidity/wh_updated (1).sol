// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PackageTracker {
    // Define a struct to hold wholesaler and package details
    struct Package {
        uint256 wholesalerId; // Changed from string to uint256
        string[] packageNames;
    }

    // Dynamic array of Packages
    Package[] public packages;

    // Function to add a new package to the array
    function addPackage(uint256 _wholesalerId, string[] memory _packageNames) public {
        Package memory newPackage;
        newPackage.wholesalerId = _wholesalerId;
        newPackage.packageNames = _packageNames;
        packages.push(newPackage);
    }

    // Function to get the package details at a specific index
    function getPackage(uint256 index) public view returns (uint256, string[] memory) {
        return (packages[index].wholesalerId, packages[index].packageNames);
    }

    // Function to find packages by wholesaler id
    function findPackagesByWholesaler(uint256 _wholesalerId) public view returns (string[] memory) {
        for (uint256 i = 0; i < packages.length; i++) {
            if (packages[i].wholesalerId == _wholesalerId) {
                return packages[i].packageNames;
            }
        }
        // Return an empty array if no packages found for the wholesaler
        string[] memory emptyArray;
        return emptyArray;
    }

    // Function to find wholesaler id by package name
    function findWholesalerByPackage(string memory _packageName) public view returns (uint256) {
        for (uint256 i = 0; i < packages.length; i++) {
            for (uint256 j = 0; j < packages[i].packageNames.length; j++) {
                if (keccak256(abi.encodePacked(packages[i].packageNames[j])) == keccak256(abi.encodePacked(_packageName))) {
                    return packages[i].wholesalerId;
                }
            }
        }
        // Return 0 if no wholesaler found for the package (assuming wholesalerId starts from 1)
        return 0;
    }

    // Function to count the total number of packages
    function countPackages() public view returns (uint256) {
        return packages.length;
    }

    // Additional functions and modifications can be added based on your requirements
}

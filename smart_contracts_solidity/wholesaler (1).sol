// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PackageTracker {
    // Define a struct to hold wholesaler and package details
    struct Package {
        string wholesalerName;
        string[] packageNames;
    }

    // Dynamic array of Packages
    Package[] public packages;

    // Function to add a new package to the array
    function addPackage(string memory _wholesalerName, string[] memory _packageNames) public {
        Package memory newPackage;
        newPackage.wholesalerName = _wholesalerName;
        newPackage.packageNames = _packageNames;
        packages.push(newPackage);
    }

    // Function to get the package details at a specific index
    function getPackage(uint256 index) public view returns (string memory, string[] memory) {
        return (packages[index].wholesalerName, packages[index].packageNames);
    }

    // Function to find packages by wholesaler name
    function findPackagesByWholesaler(string memory _wholesalerName) public view returns (string[] memory) {
        for (uint256 i = 0; i < packages.length; i++) {
            if (keccak256(abi.encodePacked(packages[i].wholesalerName)) == keccak256(abi.encodePacked(_wholesalerName))) {
                return packages[i].packageNames;
            }
        }
        // Return an empty array if no packages found for the wholesaler
        string[] memory emptyArray;
        return emptyArray;
    }

    // Function to find wholesaler name by package name
    function findWholesalerByPackage(string memory _packageName) public view returns (string memory) {
        for (uint256 i = 0; i < packages.length; i++) {
            for (uint256 j = 0; j < packages[i].packageNames.length; j++) {
                if (keccak256(abi.encodePacked(packages[i].packageNames[j])) == keccak256(abi.encodePacked(_packageName))) {
                    return packages[i].wholesalerName;
                }
            }
        }
        // Return an empty string if no wholesaler found for the package
        return "";
    }

    // Function to count the total number of packages
    function countPackages() public view returns (uint256) {
        return packages.length;
    }

    // Additional functions and modifications can be added based on your requirements
}
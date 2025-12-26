// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PostManufactured {
    address public manufacturer; // Address of the manufacturer
    

    struct Package {
        uint256 manufacturerId; // Manufacturer ID
        string packageId; // Package ID
        uint256 timestamp; // Timestamp of manufacturing
    }

    Package[] public manufacturedPackages; // Array to store manufactured packages

    event PackagePosted(uint256 manufacturerId, string packageId, uint256 timestamp);

    // Modifier to ensure that only the manufacturer can execute certain functions
    modifier onlyManufacturer() {
        require(msg.sender == manufacturer, "Only manufacturer can call this function");
        _;
    }

    // Constructor to initialize the contract with the manufacturer's address
    constructor() {
        manufacturer = msg.sender;
    }

    // Function to post a new manufactured package
    function postManufacturedPackage(uint256 _manufacturerId, string memory _packageId) external onlyManufacturer {
        Package memory newPackage = Package({
            manufacturerId: _manufacturerId,
            packageId: _packageId,
            timestamp: block.timestamp
        });

        manufacturedPackages.push(newPackage);

        emit PackagePosted(_manufacturerId, _packageId, block.timestamp);
    }

    // Function to get the details of a specific manufactured package by index
    // Modified to include all packages for a specific manufacturerId

    // Function to find manufacturer_id by packageId and return all information
    function getPackageByPackageId(string memory _packageId) external view returns (uint256, string memory, uint256) {
        for (uint256 i = 0; i < manufacturedPackages.length; i++) {
            if (keccak256(abi.encodePacked(manufacturedPackages[i].packageId)) == keccak256(abi.encodePacked(_packageId))) {
                return (
                    manufacturedPackages[i].manufacturerId,
                    manufacturedPackages[i].packageId,
                    manufacturedPackages[i].timestamp
                );
            }
        }
        revert("Package ID not found");
    }

    // Function to get the total number of manufactured packages
    function getManufacturedPackagesCount() external view returns (uint256) {
        return manufacturedPackages.length;
    }

    // Function to get indices of packages by a particular manufacturer
    function getPackageIndicesByManufacturerId(uint256 _manufacturerId) external view returns (uint256[] memory) {
        uint256 count = 0;

        // Count the number of packages for the given manufacturerId
        for (uint256 i = 0; i < manufacturedPackages.length; i++) {
            if (manufacturedPackages[i].manufacturerId == _manufacturerId) {
                count++;
            }
        }

        // Create an array to store indices
        uint256[] memory indices = new uint256[](count);

        // Fill the array with indices of packages for the given manufacturerId
        count = 0;
        for (uint256 i = 0; i < manufacturedPackages.length; i++) {
            if (manufacturedPackages[i].manufacturerId == _manufacturerId) {
                indices[count] = i;
                count++;
            }
        }

        return indices;
    }
}

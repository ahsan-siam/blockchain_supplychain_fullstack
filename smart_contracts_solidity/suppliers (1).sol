// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplierContract {
    // Define a struct to hold supplier details
    struct Supplier {
        uint256 supplier_id;
        string[] packages;
    }

    // Dynamic array of suppliers
    Supplier[] public suppliers;

    // Function to add a new supplier to the array
    function addSupplier(uint256 _supplier_id, string[] memory _packages) public {
        Supplier memory newSupplier;
        newSupplier.supplier_id = _supplier_id;
        newSupplier.packages = _packages;
        suppliers.push(newSupplier);
    }

    // Function to get the details of a specific supplier
    function getSupplier(uint256 _index) public view returns (uint256, string[] memory) {
        require(_index < suppliers.length, "Index out of bounds");
        return (suppliers[_index].supplier_id, suppliers[_index].packages);
    }

    // Function to get the total number of suppliers
    function getSupplierCount() public view returns (uint256) {
        return suppliers.length;
    }

    // Function to find suppliers by package
    function findSupplierByPackage(string memory _package) public view returns (uint256[] memory) {
        uint256[] memory matchingSuppliers = new uint256[](suppliers.length); // Initialize with fixed size

        uint256 count = 0; // Counter for the number of matching suppliers

        for (uint256 i = 0; i < suppliers.length; i++) {
            for (uint256 j = 0; j < suppliers[i].packages.length; j++) {
                if (keccak256(abi.encodePacked(suppliers[i].packages[j])) == keccak256(abi.encodePacked(_package))) {
                    // Found a match, add the supplier's ID to the result array
                    matchingSuppliers[count] = suppliers[i].supplier_id;
                    count++;
                    break; // No need to check further packages for this supplier
                }
            }
        }

        // Resize the array to the actual number of matching suppliers
        assembly {
            mstore(matchingSuppliers, count)
        }

        return matchingSuppliers;
    }

    // Function to find supplies by supplier ID
    function getSuppliesById(uint256 _supplierId) public view returns (string[] memory) {
        for (uint256 i = 0; i < suppliers.length; i++) {
            if (suppliers[i].supplier_id == _supplierId) {
                return suppliers[i].packages;
            }
        }

        // Return an empty array if no supplier found
        return new string[](0);
    }

    // Function to fetch all supplies from all suppliers
    function getAllSupplies() public view returns (uint256[] memory, string[] memory) {
        uint256 totalSupplies = 0;

        // Calculate the total number of supplies across all suppliers
        for (uint256 i = 0; i < suppliers.length; i++) {
            totalSupplies += suppliers[i].packages.length;
        }

        // Initialize arrays to store all supplies
        uint256[] memory supplierIds = new uint256[](totalSupplies);
        string[] memory allSupplies = new string[](totalSupplies);

        uint256 currentSupplyIndex = 0;

        // Loop through all suppliers and their supplies
        for (uint256 i = 0; i < suppliers.length; i++) {
            for (uint256 j = 0; j < suppliers[i].packages.length; j++) {
                supplierIds[currentSupplyIndex] = suppliers[i].supplier_id;
                allSupplies[currentSupplyIndex] = suppliers[i].packages[j];
                currentSupplyIndex++;
            }
        }

        return (supplierIds, allSupplies);
    }
}
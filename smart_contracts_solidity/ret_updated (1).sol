// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RetailerContract {
    
    event RetailerRegistered(uint indexed id, string packageInfo);
    
    struct Retailer {
        uint id; // Changed from 'int' to 'uint'
        string packageInfo;
    }
    
    mapping(uint => Retailer) retailersById; // Changed mapping key to 'uint'
    mapping(string => Retailer) retailersByPackageInfo;
    
    function registerRetailer(uint _id, string memory _packageInfo) external {
        
        retailersById[_id] = Retailer(_id, _packageInfo);
        retailersByPackageInfo[_packageInfo] = Retailer(_id, _packageInfo);
        
        emit RetailerRegistered(_id, _packageInfo);
    }
    
    function getRetailerById(uint _id) external view returns (uint, string memory) {
        Retailer memory retailer = retailersById[_id];
        return (retailer.id, retailer.packageInfo);
    }
    
    function getRetailerByPackageInfo(string memory _packageInfo) external view returns (uint, string memory) {
        Retailer memory retailer = retailersByPackageInfo[_packageInfo];
        return (retailer.id, retailer.packageInfo);
    }
    
}

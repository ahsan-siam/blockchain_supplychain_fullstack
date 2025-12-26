// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RetailerContract {
    
    event RetailerRegistered(string name, string packageInfo);
    
    struct Retailer {
        string name;
        string packageInfo;
    }
    
    mapping(string => Retailer) retailersByName;
    mapping(string => Retailer) retailersByPackageInfo;
    
    function registerRetailer(string memory _name, string memory _packageInfo) external {
        
        retailersByName[_name] = Retailer(_name, _packageInfo);
        retailersByPackageInfo[_packageInfo] = Retailer(_name, _packageInfo);
        
        emit RetailerRegistered(_name, _packageInfo);
    }
    
    function getRetailerByName(string memory _name) external view returns (string memory, string memory) {
        Retailer memory retailer = retailersByName[_name];
        return (retailer.name, retailer.packageInfo);
    }
    
    function getRetailerByPackageInfo(string memory _packageInfo) external view returns (string memory, string memory) {
        Retailer memory retailer = retailersByPackageInfo[_packageInfo];
        return (retailer.name, retailer.packageInfo);
    }
    
    
}
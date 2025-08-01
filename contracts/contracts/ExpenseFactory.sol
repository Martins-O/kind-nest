// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./GroupTreasury.sol";

contract ExpenseFactory {
    struct GroupInfo {
        address groupAddress;
        string name;
        address creator;
        uint256 createdAt;
        bool active;
    }

    mapping(address => address[]) private userGroups;
    mapping(address => GroupInfo) public groupInfos;
    address[] private allGroups;
    
    event GroupCreated(address indexed group, address indexed creator, string name);
    event GroupDeactivated(address indexed group);

    function createGroup(string memory _name, string memory _creatorNickname) external returns (address) {
        require(bytes(_name).length > 0, "Group name required");
        require(bytes(_creatorNickname).length > 0, "Creator nickname required");
        
        GroupTreasury newGroup = new GroupTreasury(_name, msg.sender, _creatorNickname);
        address groupAddress = address(newGroup);
        
        GroupInfo memory groupInfo = GroupInfo({
            groupAddress: groupAddress,
            name: _name,
            creator: msg.sender,
            createdAt: block.timestamp,
            active: true
        });
        
        groupInfos[groupAddress] = groupInfo;
        userGroups[msg.sender].push(groupAddress);
        allGroups.push(groupAddress);
        
        emit GroupCreated(groupAddress, msg.sender, _name);
        return groupAddress;
    }

    function getUserGroups(address _user) external view returns (address[] memory) {
        return userGroups[_user];
    }

    function getAllGroups() external view returns (address[] memory) {
        uint256 activeCount = 0;
        
        // Count active groups
        for (uint256 i = 0; i < allGroups.length; i++) {
            if (groupInfos[allGroups[i]].active) {
                activeCount++;
            }
        }
        
        // Create array of active groups
        address[] memory activeGroups = new address[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < allGroups.length; i++) {
            if (groupInfos[allGroups[i]].active) {
                activeGroups[index] = allGroups[i];
                index++;
            }
        }
        
        return activeGroups;
    }

    function getGroupInfo(address _groupAddress) external view returns (GroupInfo memory) {
        require(groupInfos[_groupAddress].active, "Group not found or inactive");
        return groupInfos[_groupAddress];
    }

    function getUserGroupsWithInfo(address _user) external view returns (GroupInfo[] memory) {
        address[] memory userGroupAddresses = userGroups[_user];
        uint256 activeCount = 0;
        
        // Count active groups for user
        for (uint256 i = 0; i < userGroupAddresses.length; i++) {
            if (groupInfos[userGroupAddresses[i]].active) {
                activeCount++;
            }
        }
        
        // Create array of active group infos
        GroupInfo[] memory activeGroupInfos = new GroupInfo[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < userGroupAddresses.length; i++) {
            if (groupInfos[userGroupAddresses[i]].active) {
                activeGroupInfos[index] = groupInfos[userGroupAddresses[i]];
                index++;
            }
        }
        
        return activeGroupInfos;
    }

    function addUserToGroup(address _user, address _groupAddress) external {
        // Verify the group exists and is active
        require(groupInfos[_groupAddress].active, "Group not found or inactive");
        
        // Verify the caller is the group contract itself (for when users are added to groups)
        require(msg.sender == _groupAddress, "Only group contract can add users");
        
        // Add group to user's list if not already present
        address[] memory currentGroups = userGroups[_user];
        bool alreadyMember = false;
        
        for (uint256 i = 0; i < currentGroups.length; i++) {
            if (currentGroups[i] == _groupAddress) {
                alreadyMember = true;
                break;
            }
        }
        
        if (!alreadyMember) {
            userGroups[_user].push(_groupAddress);
        }
    }

    function deactivateGroup(address _groupAddress) external {
        require(groupInfos[_groupAddress].active, "Group not found or inactive");
        require(
            msg.sender == groupInfos[_groupAddress].creator || 
            msg.sender == _groupAddress, 
            "Only creator or group contract can deactivate"
        );
        
        groupInfos[_groupAddress].active = false;
        emit GroupDeactivated(_groupAddress);
    }

    function getTotalGroupsCount() external view returns (uint256) {
        return allGroups.length;
    }

    function getActiveGroupsCount() external view returns (uint256) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < allGroups.length; i++) {
            if (groupInfos[allGroups[i]].active) {
                activeCount++;
            }
        }
        return activeCount;
    }
}
package com.rozelux.springbootmvc.DAO;


import com.rozelux.springbootmvc.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository <Role,Long> {
    Role findRoleByRole (String role);
}

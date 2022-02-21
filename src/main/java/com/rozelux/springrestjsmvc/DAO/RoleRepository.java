package com.rozelux.springrestjsmvc.DAO;


import com.rozelux.springrestjsmvc.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository <Role,Long> {
    Role findRoleByRole (String role);
    boolean existsByRole (String role);
}

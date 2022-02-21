package com.rozelux.springrestjsmvc.service;

import com.rozelux.springrestjsmvc.DAO.RoleRepository;
import com.rozelux.springrestjsmvc.model.Role;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
@Transactional
public class RoleServiceImpl implements RoleService{

    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void add(Role role) {
        roleRepository.save(role);
    }

    @Override
    public List<Role> findAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    public void remove(long id) {
        roleRepository.deleteById(id);
    }

    @Override
    public void update(Role role) {
        roleRepository.save(role);
    }

    @Override
    public Role getRole(long id) {
        return roleRepository.getById(id);
    }

    @Override
    public Role getRoleByName(String role) {
        return roleRepository.findRoleByRole(role);
    }
}

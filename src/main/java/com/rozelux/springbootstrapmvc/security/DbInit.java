package com.rozelux.springbootstrapmvc.security;

import com.rozelux.springbootstrapmvc.DAO.RoleRepository;
import com.rozelux.springbootstrapmvc.DAO.UserRepository;
import com.rozelux.springbootstrapmvc.model.Role;
import com.rozelux.springbootstrapmvc.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.HashSet;

@Component
public class DbInit {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @PostConstruct
    private void postConstruct(){
        Role adminRole = new Role("ROLE_ADMIN");
        adminRole.setId(1);
        Role userRole = new Role("ROLE_USER");
        userRole.setId(2);

        roleRepository.save(adminRole);
        roleRepository.save(userRole);

        User admin = new User("admin","admin","admin@mail.ru", 35, "admin");
        HashSet<Role> adminRoles = new HashSet<>();
        adminRoles.add(roleRepository.findRoleByRole("ROLE_ADMIN"));
        adminRoles.add(roleRepository.findRoleByRole("ROLE_USER"));
        admin.setRoles(adminRoles);
        admin.setId(1);

        userRepository.save(admin);

        User user = new User("user", "user", "user@mail.ru", 30, "user");
        HashSet<Role> userRoles = new HashSet<>();
        userRoles.add(userRole);
        user.setRoles(userRoles);
        user.setId(2);

        userRepository.save(user);
    }
}

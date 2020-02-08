package com.fstt.edocs.controller;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fstt.edocs.message.request.LoginForm;
import com.fstt.edocs.message.request.SignUpForm;
import com.fstt.edocs.message.response.JwtResponse;
import com.fstt.edocs.model.Role;
import com.fstt.edocs.model.RoleName;
import com.fstt.edocs.model.User;
import com.fstt.edocs.repository.RoleRepository;
import com.fstt.edocs.repository.UserRepository;
import com.fstt.edocs.security.jwt.JwtProvider;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthRestAPIs {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtProvider jwtProvider;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginForm loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtProvider.generateJwtToken(authentication);
        String username = loginRequest.getUsername();
        User requestSender = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("Fail! -> Cause: User  not found."));
        JwtResponse responsetoken  = new JwtResponse(jwt);
        Map<String,Object> map = new HashMap<String,Object>();
        map.put("accessToken", responsetoken.getTokenType()+" "+responsetoken.getAccessToken());
        map.put("user",requestSender.getId()+"");
        map.put("role",requestSender.getRoles());
        return ResponseEntity.ok(map);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpForm signUpRequest) {
    	Map<String,String> map = new HashMap<String,String>();
        
        if(userRepository.existsByUsername(signUpRequest.getUsername())) {
        	map.put("error","username existe" );
            return ResponseEntity.ok(map);
        }

        if(userRepository.existsByEmail(signUpRequest.getEmail())) {
        	map.put("error","email existe" );
            return ResponseEntity.ok(map);
        }

        // Creating user's account
        User user = new User(signUpRequest.getNom(),signUpRequest.getPrenom(), signUpRequest.getUsername(),
                signUpRequest.getEmail(), encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        strRoles.forEach(role -> {
        	switch(role) {
	    		case "admin":
	    			Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
	                .orElseThrow(() -> new RuntimeException("Fail! -> Cause: User Role not find."));
	    			roles.add(adminRole);
	    			
	    			break;
	    		case "pm":
	            	Role pmRole = roleRepository.findByName(RoleName.ROLE_PM)
	                .orElseThrow(() -> new RuntimeException("Fail! -> Cause: User Role not find."));
	            	roles.add(pmRole);
	            	
	    			break;
	    		default:
	        		Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
	                .orElseThrow(() -> new RuntimeException("Fail! -> Cause: User Role not find."));
	        		roles.add(userRole);        			
        	}
        });
        
        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok().body("User registered successfully!");
        
    }
        
        @GetMapping("user/{id}")
public User getUser(@PathVariable Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("Fail! -> Cause: User  not found."));
        }
    }

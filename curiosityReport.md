# How does Docker work at a low level, especially on Windows?  

### Difference Between User Space and Kernel Space  
- User space is the space in memory where "normal user processes run". This is where
Docker runs.  
- Kernel space is where the kernel runs, which is the core program of the os operates.
It "manages system calls, device drives, filesystem, privilege, and many more."  
- Because Docker runs on the user space, Docker builds running different linux distributions
still use the same underlying kernel. I think this is why Docker isn't a VM; it's not virutalizing
the entire OS including the kernel, it's just wrapping system calls to the kernel.  

### The Docker Deamon  
- The Docker Deamon does most of the hard work of managing and running Docker containers and images.  
- It receives requests from the Docker client.  
- The Docker client is just the tool that sends commands to the Docker Deamon.  
![Docker Diagram](./dockerDiagram.webp)  

### Docker Implementation  
- Written in Go: works quickly, and solves some security problems  
- Takes advantage of Linux kernel features  

### So how does Docker run on Windows and macOS?  
- When Docker is running on a non-Linux environment, it would actually run a Linux VM inbetween
the native OS and the Docker container.  
    - When Windows added Windows Subsystem for Linux, Docker could start running natively on
    Windows  
- It appears that MacOS still has to use the hypervisor to run a super light weight virtual machine.  

## Wait, so how does Windows Subsystem for Linux work??  
- under the hood, "WSL 2 uses virtualization technology to run a Linux kernal inside of a lightweight
utility virtual machine (VM)." I thought it didn't involve a virtual machine, but clearly Microsoft
is using a lightweight VM that is baked in.  
- WSL is an alternative to dual booting, which sounds like a pain to do.  
- Some source say that WSL removes the need for a virtual machine, although I take that to mean that
the user does not have to care about installing or knowing about a virtual machine (Windows still
technically uses a lightweight one under the hood).  
- WSL 2 actually provides a full Linux kernel and therefore supports more Linux binaries than WSL 1,
which was missing many system calls.  
- The way that Windows runs WSL 2 is supposed to be easier on resources (CPU, memory, etc.) than
when running a full virtual machine. This is accomplished by using "virtualization through a highly
optimized subset of Hyper-V features, in order to run the kernal and distributions (based upon the
kernel), promising performance equivalent to WSL 1.  

I have dug around my Windows machine and found the Windows comes with a lot of guides and links
to documentation for WSL 2. They are clearly making it easy to use. While digging around, I learned
that it is easy to set it up to do some of the following:  
- use `localhost:<port>` to access ports exposed inside of WSL.  
- run GUI applications on WSL and have them accessible like any other Windows app ( alt + tab,
task bar pinning, etc. ).  
- Try out different Linux distributions. Here are some of the commands to do that  
    - `wsl --install -d <distro-name>` - install a specific Linux distrubution  
    - `wsl --list --online` - lists the available distrubutions online  
    - `wsl --import <disto name> <path>` - imports a custom distrubution stored on your machine  
    - `wsl -d <distro name>` - launches the specified distrubution  
- You can even create a custom Linux distribution and run into just like any other distribution
on WSL by [defining various configurations and packaging the distrubution as a tar file.](https://learn.microsoft.com/en-us/windows/wsl/build-custom-distro)  

It turns out that you can run multiple Linux distributions on WSL at the same time, which has got to
be pretty helpful for testing across various distributions.  

## I thought MacOS used Linux or something like that. What does MacOS actually use?  
- MacOS is built on Darwin and shares some Unix-like features with Linux, but is fundamentally
NOT Linux.  
- Both come from Unix, which is a much older operating system with many different operating systems built off of
it sincei t came out in 1977. So macOS and Linux may feel similar on the surface, but are totally different operating systems.  
const apiService = new ApiService();
apiService.getTasks(
    function (tasks) {
      console.log(tasks);
    },
    function (error) {
      console.log(error);
    }
);
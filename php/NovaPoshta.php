<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Admin
 * Date: 30.05.13
 * Time: 8:54
 * To change this template use File | Settings | File Templates.
 */

namespace Core;


class NovaPoshta
{
    const API_URL = 'http://np.artefact.in.ua/';

    protected $_lang = null;

    public function __construct($lang)
    {
        $this->_lang = $lang;
    }

    public function request($request)
    {
        $json = $this->_request(self::API_URL . ltrim($request, '/'));

        return json_decode($json, true);
    }

    public function createRequest(array $params)
    {
        array_unshift($params, $this->_lang);

        $request = implode('/', $params);

        return $request;
    }

    public function getByType($type, $id)
    {
        if(!$type || $id <= 0)
            return array();

        $result = $this->request($this->createRequest(array(
            $id, $type
        )));

        return current($result);
    }

    public function getRegion($id)
    {
        return $this->getByType('region', $id);
    }

    public function getCity($id)
    {
        return $this->getByType('city', $id);
    }

    public function getDepartment($id)
    {
        return $this->getByType('department', $id);
    }

    public function getListById($ids)
    {
        $result = $this->request(
            $this->createRequest(array(
                    implode('|', $ids)
                )
            )
        );

        return $result;
    }

    public function arrayFieldKey($field, $input)
    {
		if(empty($input))
			return array();
	
        $output = array();

        foreach($input as $arr)
        {
            if(!empty($arr[$field]))
                $output[$arr[$field]] = $arr;
        }

        return $output;
    }

    private function _request($url)
    {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        $response = curl_exec($ch);

        curl_close($ch);

        return $response;
    }

}